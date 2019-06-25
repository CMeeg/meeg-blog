const DeliveryClient = require('./delivery-client');
const changeCase = require('change-case');

class KenticoCloudSource {
    static defaultOptions () {
        return {
            projectId: undefined,
            previewApiKey: undefined,
            contentTypes: {}
        }
    };

    constructor (api, options) {
        this.options = options;
        
        this.deliveryClient = new DeliveryClient(options);

        api.loadSource(async store => this.loadKenticoCloudSource(store));
    }

    async loadKenticoCloudSource(store) {        
        const dataSourceContentTypes = await this.addContentTypes(store);

        for (const dataSourceContentType of dataSourceContentTypes) {
            await this.addContent(store, dataSourceContentType);
        }
    }

    async addContentTypes(store) {
        // Get content types from the delivery client

        const contentTypes = await this.deliveryClient.getContentTypes();

        // Add each content type to the store

        const dataSourceContentTypes = [];

        for (const contentType of contentTypes) {
            const { system: { name, codename } } = contentType;

            // Get route from options, or fallback to a sensible default

            const contentTypeOptions = this.options.contentTypes[codename];
            let route = `/${store.slugify(name)}/:slug`;

            if (contentTypeOptions) {
                route = contentTypeOptions.route || route;
            }

            // Get Gridsome friendly node type name

            const typeName = changeCase.pascalCase(name);

            // Add Content Type to store

            store.addContentType({ typeName, route });

            dataSourceContentTypes.push({ codename, typeName, contentType });
        }

        return dataSourceContentTypes;
    }
    
    async addContent(store, dataSourceContentType) {
        const { codename, typeName, contentType } = dataSourceContentType;

        // Get content from the delivery client

        const content = await this.deliveryClient.getContent(codename);

        const { items: contentItems, linkedItems } = content;

        // Get the content type collection from the store and add the content to it

        const collection = store.getContentType(typeName);

        for (const contentItem of contentItems) {
            // Get basic item data

            const { system: { id, name, codename, language, lastModified: date } } = contentItem;
            const slug = store.slugify(name);

            // Initialise fields from basic item data

            const fields = {
                id,
                name,
                slug,
                codename,
                date,
                language
            };
            
            // Add Content Elements as fields

            for (const element of contentType.elements) {
                const { codename, name, type } = element;

                const contentElement = contentItem.elements[codename];

                if (type === 'url_slug') {
                    // If the content element is a URL slug we need to update the default slug value

                    fields.slug = contentElement.value;

                    continue;
                }
                
                // Otherwise, add the content element as a "custom" field

                const fieldName = changeCase.camelCase(name);

                fields[fieldName] = contentElement.value;
            }

            // Add the content to the collection

            collection.addNode(fields);
        }
    }
}

module.exports = KenticoCloudSource;