import { autorun, observable } from '../src'

class Counter {
    @observable count = 0;
    increment() {
        this.count++;
    }
}
const counter = new Counter()
autorun(() => {
    console.log(`count=${counter.count}`)
})

counter.increment()
