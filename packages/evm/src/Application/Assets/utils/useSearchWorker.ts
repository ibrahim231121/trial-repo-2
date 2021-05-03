import SearchWorker from "./search.worker";

export default class Singleton {

    private static instance: Worker;

    private constructor() {
        console.log("constructor called!");
    }

    public static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance =  new SearchWorker();
        }
        return Singleton.instance;
    }


}