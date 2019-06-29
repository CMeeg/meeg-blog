const {TypeResolver, DeliveryClient } = require('kentico-cloud-delivery');

class GridsomeDeliveryClient {
    constructor(options) {
        this.options = options;

        const deliveryClientOptions = {
            projectId: options.projectId,
            typeResolvers: []
        };

        for (const contentType of options.contentTypes) {
            const codename = contentType.codename;
            const ContentType = contentType.contentType;

            deliveryClientOptions.typeResolvers.push(
                new TypeResolver(codename, () => new ContentType(codename))
            );
        }

        if (options.previewApiKey) {
            deliveryClientOptions.enablePreviewMode = true;
            deliveryClientOptions.previewApiKey = options.previewApiKey;
        }

        this.deliveryClient = new DeliveryClient(deliveryClientOptions);
    }

    async getContentTypes() {
        const contentTypesPromise = await this.deliveryClient
            .types()
            .getPromise();

        return contentTypesPromise;
    }
    
    async getContent(codename) {
        const contentPromise = await this.deliveryClient
            .items()
            .type(codename)
            .getPromise();

        return contentPromise;
    }

    async getTaxonomyGroups() {
        const taxonomyGroupsPromise = await this.deliveryClient
            .taxonomies()
            .getPromise();

        return taxonomyGroupsPromise;
    }
}

module.exports = GridsomeDeliveryClient;