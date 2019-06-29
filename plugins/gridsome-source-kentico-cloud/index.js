const DeliveryClient = require('./delivery-client');
const KenticoCloudSource = require('./kentico-cloud-source');
const DefaultContentType = require('./types/GridsomeContentType');

class KenticoCloudSourcePlugin {
    static defaultOptions() {
        return {
            projectId: undefined,
            previewApiKey: undefined,
            linkedItemTypeName: 'LinkedItem',
            taxonomyTypeNamePrefix: 'Taxonomy',
            contentTypes: {},
            defaultContentType: DefaultContentType,
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
        var deliveryClient = new DeliveryClient(options);

        var kenticoCloudSource = new KenticoCloudSource(deliveryClient, options);

        api.loadSource(async store => kenticoCloudSource.load(store));
    }
}

module.exports = KenticoCloudSourcePlugin;