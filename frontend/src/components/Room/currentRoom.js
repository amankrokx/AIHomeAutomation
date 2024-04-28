class CurrentRoom {
    constructor() {
        this.activeRoom = null;
    }

    setRoom(room) {
        this.room = room;
    }

    getRoom() {
        return this.room;
    }
}

const currentRoom = new CurrentRoom();

export default currentRoom;