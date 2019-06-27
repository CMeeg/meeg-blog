const DeliveryClient = require('./delivery-client');
const changeCase = require('change-case');

class KenticoCloudSource {
    static defaultOptions () {
        return {
            projectId: undefined,
            previewApiKey: undefined,
            linkedItemTypeName: 'LinkedItem',
            taxonomyTypeNamePrefix: 'Taxonomy',
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
            const { system: { codename }, terms } = taxonomyGroup;

            // Get Gridsome friendly node type name

            // The prefix is added to prevent possible collisions with content types

            const typeName = this.options.taxonomyTypeNamePrefix + this.getTypeName(codename);

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
            const { system: { codename }, elements } = contentType;

            // Get route from options, or fallback to a sensible default

            // TODO: route should be optional
            const contentTypeOptions = this.options.contentTypes[codename];
            let route = `/${store.slugify(codename)}/:slug`;

            if (contentTypeOptions) {
                route = contentTypeOptions.route || route;
            }

            // Get Gridsome friendly node type name

            const typeName = this.getTypeName(codename);

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

        const { items: contentItems, linkedItems } = content;

        for (const contentItem of contentItems) {
            const node = this.createNode(store, contentItem);

            this.addLinkedItems(store, collection, node, linkedItems);

            // Add the content node to the collection

            collection.addNode(node.item);
        }
    }

    getTypeName(codename) {
        const typeName = changeCase.pascalCase(codename);

        return typeName;
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

        const fieldName = changeCase.camelCase(contentElement.codename);

        return fieldName;
    }

    addLinkedItems(store, collection, node, linkedItems) {
        const typeName = this.options.linkedItemTypeName;

        for (const linkedItemField of node.linkedItemFields) {
            const linkedItemFieldName = linkedItemField.fieldName;

            collection.addReference(linkedItemFieldName, typeName);

            if (collection.typeName !== typeName) {
                for (const linkedItemCodename of linkedItemField.value) {
                    const linkedItem = linkedItems.filter(item => item.system.codename === linkedItemCodename);

                    this.addLinkedItem(store, linkedItem[0], linkedItems);
                }
            }

            node.item[linkedItemFieldName] = linkedItemField.value;
        }
    }

    addLinkedItem(store, linkedItem, linkedItems) {
        const typeName = this.options.linkedItemTypeName;

        let collection = store.getContentType(typeName);

        if (typeof(collection) === 'undefined') {
            collection = store.addContentType(typeName);
        }
        
        const node = this.createNode(store, linkedItem);
        node.item.sourceId = node.item.id;
        node.item.id = node.item.codename;

        this.addLinkedItems(store, collection, node, linkedItems);

        const existingNode = collection.getNode(node.item.id);

        if (existingNode === null) {
            collection.addNode(node.item);
        }
    }

    createNode(store, contentItem) {
        // Get system data

        // TODO: Sitemap locations?

        const { system: { id, name, codename, language, type, lastModified }, elements } = contentItem;

        // Initialise a content node with fields from system data, which should be consistent across all nodes

        const node = {
            item: {
                id,
                name,
                codename,
                language,
                type,
                lastModified: new Date(lastModified),
                slug: store.slugify(name)
            },
            linkedItemFields: []
        };
            
        // Add Content Elements as fields to the node

        for (const elementCodename in elements) {
            const contentElement = elements[elementCodename];
            contentElement.codename = elementCodename;

            // TODO:
            // * Asset
            // * Rich text
            // * Custom element

            const fieldName = this.getElementFieldName(contentElement);

            if (contentElement.type === 'modular_content') {
                const linkedItemField = {
                    fieldName,
                    value: contentElement.value
                };
                
                node.linkedItemFields.push(linkedItemField);

                continue;
            }

            const elementResolver = this.getElementResolver(contentElement);

            if (typeof(elementResolver) === 'undefined') {
                continue;
            }

            // Get the element's value

            const fieldValue = elementResolver(contentElement);
            
            // Add the content element as a "custom" field on the node

            node.item[fieldName] = fieldValue;
        }

        return node;
    }
}

module.exports = KenticoCloudSource;