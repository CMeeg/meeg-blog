const KenticoCloud = require('kentico-cloud-delivery');
const { parse, stringify } = require('flatted/cjs');

class KenticoCloudSourceDeliveryClient {
    constructor(options) {
        this.options = options;

        // TODO: Use typeResolvers specified via options.contentTypes?
        const deliveryClientOptions = {
            projectId: options.projectId
        };

        if (options.previewApiKey) {
            deliveryClientOptions.enablePreviewMode = true;
            deliveryClientOptions.previewApiKey = options.previewApiKey;
        }

        this.deliveryClient = new KenticoCloud.DeliveryClient(deliveryClientOptions);
    }

    async getContentTypes() {
        const contentTypesPromise = await this.deliveryClient
            .types()
            .getPromise();
        
        const contentTypes = this.flatten(contentTypesPromise.types);

        return contentTypes;
    }
    
    async getContent(codename) {
        const contentPromise = await this.deliveryClient
            .items()
            .type(codename)
            .getPromise();

        const content = this.flatten(contentPromise);

        return content;
    }

    flatten(json) {
        return parse(stringify(json));
    }
}

module.exports = KenticoCloudSourceDeliveryClient;