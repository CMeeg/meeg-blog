const changeCase = require('change-case');

class KenticoCloudSource {
    constructor (deliveryClient, options) {
        this.deliveryClient = deliveryClient;
        this.options = options;
    }

    async load(store) {
        // TODO: Maybe don't have these as class fields?
        this.taxonomyGroups = await this.getTaxonomyGroups();

        this.contentTypes = await this.getContentTypes();

        for (const contentType of this.contentTypes) {
            await this.addContentType(store, contentType);
        }
    }

    async getTaxonomyGroups() {
        const rawTaxonomyGroups = await this.deliveryClient.getTaxonomyGroups();

        const taxonomyGroups = rawTaxonomyGroups.taxonomies.map(taxonomyGroup => {
            return {
                codename: taxonomyGroup.system.codename,
                terms: taxonomyGroup.terms
            }
        });
        
        return taxonomyGroups;
    }

    getTaxonomyGroupByCodename(codename) {
        const taxonomyGroups = this.taxonomyGroups.filter(taxonomyGroup => taxonomyGroup.codename === codename);

        if (taxonomyGroups.length === 1) {
            return taxonomyGroups[0];
        }

        // TODO: Throw error
        return;
    }

    async getContentTypes() {
        const rawContentTypes = await this.deliveryClient.getContentTypes();

        const contentTypes = rawContentTypes.types.map(contentType => this.getContentType(contentType));

        return contentTypes;
    }

    getContentType(contentType) {
        const codename = contentType.system.codename;

        const ContentType = this.options.contentTypes[codename];

        if (typeof(ContentType) === 'undefined') {
            return new this.options.defaultContentType(contentType);
        }

        return new ContentType(contentType);
    }

    getContentTypeByCodename(codename) {
        const contentTypes = this.contentTypes.filter(contentType => contentType.getCodename() === codename);

        if (contentTypes.length === 1) {
            return contentTypes[0];
        }

        // TODO: Throw error
        return;
    }

    async addContentType(store, contentType) {
        const typeName = contentType.getTypeName();
        const route = contentType.getRoute();

        const collection = store.addContentType({ typeName, route });

        const contentNodes = await this.getContentNodes(contentType);

        for (const contentNode of contentNodes) {
            this.addLinkedNodes(store, collection, contentNode);

            this.addTaxonomyNodes(store, collection, contentNode);
            
            collection.addNode(contentNode.item);
        }
    }

    async getContentNodes(contentType) {
        const content = await this.deliveryClient.getContent(contentType.getCodename());

        const contentNodes = contentType.createContentNodes(content);

        return contentNodes;
    }

    addLinkedNodes(store, collection, contentNode) {
        const typeName = this.options.linkedItemTypeName;

        for (const linkedItemField of contentNode.linkedItemFields) {
            const fieldName = linkedItemField.fieldName;

            collection.addReference(fieldName, typeName);

            if (collection.typeName !== typeName) {
                const linkedItems = contentNode.linkedItems;

                for (const codename of linkedItemField.value) {
                    const linkedItem = linkedItems.filter(item => item.system.codename === codename);

                    this.addLinkedNode(store, typeName, linkedItem[0], linkedItems);
                }
            }

            contentNode.item[fieldName] = linkedItemField.value;
        }
    }

    addLinkedNode(store, typeName, linkedItem, linkedItems) {
        let collection = store.getContentType(typeName);

        if (typeof(collection) === 'undefined') {
            collection = store.addContentType(typeName);
        }

        const contentType = this.getContentTypeByCodename(linkedItem.system.type);
        
        const linkedNode = contentType.createContentNode(linkedItem, linkedItems);
        linkedNode.item.sourceId = linkedNode.item.id;
        linkedNode.item.id = linkedNode.item.codename;

        this.addLinkedNodes(store, collection, linkedNode);

        const existingNode = collection.getNode(linkedNode.item.id);

        if (existingNode === null) {
            collection.addNode(linkedNode.item);
        }
    }

    addTaxonomyNodes(store, collection, contentNode) {
        for (const taxonomyField of contentNode.taxonomyFields) {
            const fieldName = taxonomyField.fieldName;
            const codename = taxonomyField.taxonomyGroup;

            const typeNamePrefix = this.options.taxonomyTypeNamePrefix;
            const typeName = typeNamePrefix + changeCase.pascalCase(codename);

            let taxonomyCollection = store.getContentType(typeName);

            if (typeof(taxonomyCollection) === 'undefined') {
                taxonomyCollection = store.addContentType(typeName);

                taxonomyCollection.addReference('terms', typeName);

                const taxonomyGroup = this.getTaxonomyGroupByCodename(codename);

                this.addTaxonomyTerms(taxonomyCollection, taxonomyGroup.terms);
            }

            collection.addReference(fieldName, typeName);
        }
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
}

module.exports = KenticoCloudSource;