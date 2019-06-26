const DeliveryClient = require('./delivery-client');
const changeCase = require('change-case');

class KenticoCloudSource {
    static defaultOptions () {
        return {
            projectId: undefined,
            previewApiKey: undefined,
            contentTypes: {},
            elementResolvers: {
                number: KenticoCloudSource.defaultNumberElementResolver,
                date_time: KenticoCloudSource.defaultDateTimeElementResolver,
                multiple_choice: KenticoCloudSource.defaultMultipleChoiceElementResolver,
                taxonomy: KenticoCloudSource.defaultTaxonomyElementResolver,
                default: KenticoCloudSource.defaultElementResolver
            }
        }
    };

    constructor (api, options) {
        this.options = options;
        
        this.deliveryClient = new DeliveryClient(options);

        api.loadSource(async store => this.loadKenticoCloudSource(store));
    }

    async loadKenticoCloudSource(store) {
        const taxonomyGroups = await this.addTaxonomyGroups(store);
        
        await this.addContent(store, taxonomyGroups);
    }

    async addTaxonomyGroups(store) {
        // Get taxonomy groups from the delivery client

        const taxonomyGroups = await this.deliveryClient.getTaxonomyGroups();
        
        const taxonomyGroupsMap = {};

        for (const taxonomyGroup of taxonomyGroups.taxonomies) {
            const { system: { name, codename }, terms } = taxonomyGroup;

            // Get Gridsome friendly node type name

            // TODO: The prefix is to prevent collisions with content types, but this should really be configurable

            const typeName = 'Taxonomy' + changeCase.pascalCase(name);

            // Add taxonomy group to store

            const collection = store.addContentType(typeName);
            collection.addReference('terms', typeName);

            // Add taxonomy terms to the collection

            this.addTaxonomyTerms(collection, terms);

            // Add the type name to a map so it can be found using the codename

            taxonomyGroupsMap[codename] = typeName;
        }

        return taxonomyGroupsMap;
    }

    addTaxonomyTerms(collection, terms) {
        if (terms.length === 0) {
            return;
        }

        for (const term of terms) {
            collection.addNode({
                id: term.codename,
                name: term.name,
                terms: term.terms.map(childTerm => childTerm.codename)
            });

            // Terms can be nested

            this.addTaxonomyTerms(collection, term.terms);
        }
    }

    async addContent(store, taxonomyGroups) {
        // Get content types from the delivery client

        const contentTypes = await this.deliveryClient.getContentTypes();

        // Add content of each type to the store

        for (const contentType of contentTypes) {
            const { system: { name, codename }, elements } = contentType;

            // Get route from options, or fallback to a sensible default

            // TODO: route should be optional
            const contentTypeOptions = this.options.contentTypes[codename];
            let route = `/${store.slugify(name)}/:slug`;

            if (contentTypeOptions) {
                route = contentTypeOptions.route || route;
            }

            // Get Gridsome friendly node type name

            const typeName = changeCase.pascalCase(name);

            // Add content type to store

            const collection = store.addContentType({ typeName, route });

            // If the content type has taxonomy elements, those elements need to be made available as references

            const taxonomyElements = elements
                .filter(element => element.type === 'taxonomy');

            for (const taxonomyElement of taxonomyElements) {                
                const taxonomyContentType = taxonomyGroups[taxonomyElement.taxonomyGroup];

                if (typeof(taxonomyContentType) === 'undefined') {
                    continue;
                }

                const fieldName = this.getElementFieldName(taxonomyElement);

                collection.addReference(fieldName, taxonomyContentType);
            }
            
            // Add content to store

            await this.addContentToCollection(store, collection, contentType);
        }
    }
    
    async addContentToCollection(store, collection, contentType) {
        const { system: { codename: contentTypeCodename } } = contentType;
        
        // Get content from the delivery client

        const content = await this.deliveryClient.getContent(contentTypeCodename);

        // TODO: linkedItems

        const { items: contentItems, linkedItems } = content;

        for (const contentItem of contentItems) {
            // Get system data

            // TODO: Sitemap locations?
            // TODO: Do we need a default slug?

            const { system: { id, name, codename, language, type, lastModified: date } } = contentItem;
            const slug = store.slugify(name);

            // Initialise a content node with fields from system data, which should be consistent across all nodes

            const node = {
                id,
                name,
                codename,
                language,
                type,
                date: new Date(date),
                slug
            };
            
            // Add Content Elements as fields to the node

            for (const element of contentType.elements) {
                const { codename: elementCodename } = element;

                const contentElement = contentItem.elements[elementCodename];

                // TODO:
                // * Linked items
                // * Asset
                // * Rich text
                // * Custom element

                const elementResolver = this.getElementResolver(contentElement);

                if (typeof(elementResolver) === 'undefined') {
                    continue;
                }

                // Get the element's value

                const fieldValue = elementResolver(contentElement);
                
                // Add the content element as a "custom" field on the node

                const fieldName = this.getElementFieldName(contentElement);

                node[fieldName] = fieldValue;
            }

            // Add the content node to the collection

            collection.addNode(node);
        }
    }

    getElementResolver(contentElement) {
        return this.options.elementResolvers[contentElement.type] || this.options.elementResolvers.default;
    }

    static defaultNumberElementResolver(contentElement) {
        return Number(contentElement.value);
    }

    static defaultDateTimeElementResolver(contentElement) {
        return new Date(contentElement.value);
    }

    static defaultMultipleChoiceElementResolver(contentElement) {
        return contentElement.value.map(value => value.name);
    }

    static defaultTaxonomyElementResolver(contentElement) {
        return contentElement.value.map(value => value.codename);
    }

    static defaultElementResolver(contentElement) {
        return contentElement.value;
    }

    getElementFieldName(contentElement) {
        if (contentElement.type === 'url_slug') {
            return 'slug';
        }

        return changeCase.camelCase(contentElement.name);
    }
}

module.exports = KenticoCloudSource;