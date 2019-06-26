const DeliveryClient = require('./delivery-client');
const changeCase = require('change-case');

class KenticoCloudSource {
    static defaultOptions () {
        return {
            projectId: undefined,
            previewApiKey: undefined,
            contentTypes: {},
            elementResolvers: {
                date_time: KenticoCloudSource.defaultDateTimeElementResolver,
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
        await this.addContent(store);
    }

    async addContent(store) {
        // Get content types from the delivery client

        const contentTypes = await this.deliveryClient.getContentTypes();

        // Add content of each type to the store

        for (const contentType of contentTypes) {
            const { system: { name, codename } } = contentType;

            // Get route from options, or fallback to a sensible default

            // TODO: route should be optional
            const contentTypeOptions = this.options.contentTypes[codename];
            let route = `/${store.slugify(name)}/:slug`;

            if (contentTypeOptions) {
                route = contentTypeOptions.route || route;
            }

            // Get Gridsome friendly node type name

            const typeName = changeCase.pascalCase(name);

            // Add content to store

            const collection = store.addContentType({ typeName, route });
            
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
                date,
                slug
            };
            
            // Add Content Elements as fields to the node

            for (const element of contentType.elements) {
                const { codename: elementCodename } = element;

                const contentElement = contentItem.elements[elementCodename];

                const elementResolver = this.getElementResolver(contentElement);

                if (typeof(elementResolver) === 'undefined') {
                    continue;
                }

                const value = elementResolver(contentElement);

                if (contentElement.type === 'url_slug') {
                    // If the content element is a URL slug we need to update the default slug value

                    node.slug = value;

                    continue;
                }
                
                // Otherwise, add the content element as a "custom" field on the node

                const fieldName = this.getElementFieldName(contentElement);

                node[fieldName] = value;
            }

            // Add the content node to the collection

            collection.addNode(node);
        }
    }

    getElementResolver(contentElement) {
        return this.options.elementResolvers[contentElement.type] || this.options.elementResolvers.default;
    }

    static defaultDateTimeElementResolver(contentElement) {
        return new Date(contentElement.value);
    }

    static defaultElementResolver(contentElement) {
        return contentElement.value;
    }

    getElementFieldName(contentElement) {
        return changeCase.camelCase(contentElement.name);
    }
}

module.exports = KenticoCloudSource;