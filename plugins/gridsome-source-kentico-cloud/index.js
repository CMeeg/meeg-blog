const KenticoCloud = require('kentico-cloud-delivery');
const { parse, stringify } = require('flatted/cjs');
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
        this.dataStoreContentTypes = [];

        // TODO: Use typeResolvers specified via options.contentTypes?
        const deliveryClientOptions = {
            projectId: options.projectId
        };

        if (options.previewApiKey) {
            deliveryClientOptions.enablePreviewMode = true;
            deliveryClientOptions.previewApiKey = options.previewApiKey;
        }

        this.deliveryClient = new KenticoCloud.DeliveryClient(deliveryClientOptions);

        api.loadSource(async store => {
            await this.getContentTypes(store);
            await this.getContent(store);
        });
    }

    async getContentTypes(store) {
        // Get Content Types from the Delivery API
        const contentTypesPromise = await this.deliveryClient
            .types()
            .getPromise();
        
        const contentTypes = parse(stringify(contentTypesPromise.types));

        for (const contentType of contentTypes) {
            const { system: { name, codename, elements } } = contentType;

            // Get typeName
            const typeName = changeCase.pascalCase(name);

            // Get route
            const contentTypeOptions = this.options.contentTypes[codename];
            let route = `/${store.slugify(name)}/:slug`;
            if (contentTypeOptions) {
                route = contentTypeOptions.route || route;
            }

            // Add Content Type to Data Store
            store.addContentType({ typeName, route });

            this.dataStoreContentTypes.push({ codename, typeName, contentType });
        }
    }
    
    async getContent(store) {
        for (const dataStoreContentType of this.dataStoreContentTypes) {
            const { codename, typeName, contentType } = dataStoreContentType;

            const contentItemsPromise = await this.deliveryClient
                .items()
                .type(codename)
                .getPromise();

            const result = parse(stringify(contentItemsPromise));
            const { items: contentItems, linkedItems } = result;

            const collection = store.getContentType(typeName);

            for (const contentItem of contentItems) {
                // Get basic item data
                const { system: { id, name, codename, language, lastModified: date } } = contentItem;
                const slug = store.slugify(name);

                // Initialise fields
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
                        fields.slug = contentElement.value;
                    }
                    else {
                        const fieldName = changeCase.camelCase(name);

                        fields[fieldName] = contentElement.value;
                    }
                }

                // Add Content Item to Data Store
                collection.addNode(fields);
            }
        }
    }
}

module.exports = KenticoCloudSource;