


export class Client {
    clientId: string;
    name: string;
    relationshipId: string;
    createdAt: Date;
    isActive: boolean;

    constructor(
        clientId: string,
        name: string,
        relationshipId: string,
        createdAt: Date,
        isActive: boolean
    ) {
        this.clientId = clientId;
        this.name = name;
        this.relationshipId = relationshipId;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }
}
