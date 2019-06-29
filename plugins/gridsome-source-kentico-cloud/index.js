const DeliveryClient = require('./GridsomeDeliveryClient');
const KenticoCloudSource = require('./KenticoCloudSource');
const glob = require('glob');
const path = require('path');

class KenticoCloudSourcePlugin {
    static defaultOptions() {
        return {
            projectId: undefined,
            previewApiKey: undefined,
            linkedItemTypeName: 'LinkedItem',
            taxonomyTypeNamePrefix: 'Taxonomy',
            contentTypesPath: './plugins/gridsome-source-kentico-cloud/content-types'
        }
    };

    constructor (api, options) {
        options.contentTypes = this.loadContentTypes(options.contentTypesPath);
        
        var deliveryClient = new DeliveryClient(options);

        var kenticoCloudSource = new KenticoCloudSource(deliveryClient, options);

        api.loadSource(async store => kenticoCloudSource.load(store));
    }

    loadContentTypes(contentTypesPath) {
        const extension = '.js';

        const contentTypesGlob = path.join(contentTypesPath, '/*') + extension;

        const contentTypes = glob.sync(contentTypesGlob).map(file => {
            const codename = path.basename(file, extension);
            const contentTypePath = path.resolve(file);
            const contentType = require(contentTypePath);

            return {
                codename,
                contentType
            };
        });

        return contentTypes;
    }
}

module.exports = KenticoCloudSourcePlugin;