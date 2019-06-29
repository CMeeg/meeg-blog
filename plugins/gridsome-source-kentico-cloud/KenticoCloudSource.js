const changeCase = require('change-case');

class KenticoCloudSource {
    constructor (deliveryClient, options) {
        this.deliveryClient = deliveryClient;
        this.options = options;
    }

    async load(store) {
        await this.addTaxonomyGroups(store);

        for (const contentType of this.options.contentTypes) {
            const codename = contentType.codename;
            const ContentType = contentType.contentType;

            await this.addContent(store, new ContentType(codename));
        }
    }

    async addTaxonomyGroups(store) {
        // TODO: Move taxonomy stuff out to another class?

        const taxonomyGroups = await this.deliveryClient.getTaxonomyGroups();

        for (const taxonomyGroup of taxonomyGroups.taxonomies) {
            const codename = taxonomyGroup.system.codename;
            const terms = taxonomyGroup.terms;

            const typeName = this.getTaxonomyTypeName(codename);

            const collection = store.addContentType(typeName);

            collection.addReference('terms', typeName);

            this.addTaxonomyTerms(collection, terms);
        }
    }

    getTaxonomyTypeName(codename) {
        const typeNamePrefix = this.options.taxonomyTypeNamePrefix;
        const typeName = typeNamePrefix + changeCase.pascalCase(codename);

        return typeName;
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

    async addContent(store, contentType) {
        const typeName = contentType.getTypeName();
        const route = contentType.getRoute();

        const collection = store.addContentType({ typeName, route });

        const content = await this.deliveryClient.getContent(contentType.codename);

        const { items: contentItems, linkedItems } = content;

        this.addLinkedItems(store, linkedItems);

        for (const contentItem of contentItems) {
            const contentNode = contentItem.createNode();

            this.addNode(collection, contentNode);
        }
    }

    addLinkedItems(store, linkedItems) {
        // TODO: Move linked item stuff out to another class?

        const typeName = this.options.linkedItemTypeName;

        const collection = store.addContentType(typeName);

        for (const linkedItem of linkedItems) {
            const linkedNode = linkedItem.createNode();

            linkedNode.item.sourceId = linkedNode.item.id;
            linkedNode.item.id = linkedNode.item.codename;

            const existingNode = collection.getNode(linkedNode.item.id);
    
            if (existingNode === null) {
                this.addNode(collection, linkedNode);
            }
        }
    }
    
    addNode(collection, node) {
        this.addLinkedItemFields(collection, node);

        this.addTaxonomyFields(collection, node);
        
        collection.addNode(node.item);
    }

    addLinkedItemFields(collection, node) {
        const typeName = this.options.linkedItemTypeName;

        for (const linkedItemField of node.linkedItemFields) {
            const fieldName = linkedItemField.fieldName;

            collection.addReference(fieldName, typeName);
        }
    }

    addTaxonomyFields(collection, node) {
        for (const taxonomyField of node.taxonomyFields) {
            const fieldName = taxonomyField.fieldName;
            const codename = taxonomyField.taxonomyGroup;

            const typeName = this.getTaxonomyTypeName(codename);

            collection.addReference(fieldName, typeName);
        }
    }
}

module.exports = KenticoCloudSource;