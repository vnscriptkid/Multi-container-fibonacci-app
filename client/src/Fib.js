import React, {Component} from 'react';
import axios from 'axios';

class Fib extends Component {

    state = {
        seenIndexes: [0, 1, 2, 7], // [ 0, 1, 2, 3, 7 ]
        seenValues: {0: 0, 1: 1, 2: 1, 7: 13}, // { 0: 0, 1: 1, 2: 1, 3: 2, 7: 13 }
        indexToSubmit: null,
        invalidIndex: false
    }

    async componentDidMount() {
        this.fetchSeenIndexes();
        this.fetchSeenValues();
    }

    fetchSeenIndexes = async () => {
        const result = await axios.get('/api/indexes');
        console.log('seenIndexes: ', result.data);
        this.setState({ seenIndexes: result.data.map(item => item.number) })
    }
    
    fetchSeenValues = async () => {
        const result = await axios.get('/api/values')
        console.log('seenValues: ', result.data);
        this.setState({ seenValues: result.data })
    }

    handleInputChange = (e) => {
        this.setState({ indexToSubmit: e.target.value }) 
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const index = parseInt(this.state.indexToSubmit);
        const indexSeen = this.state.seenIndexes.includes(index)
        if (index && !indexSeen) {
            console.log('Submit index: ', index);
            try {
                const res = await axios.post('/api/indexes', { index })
                console.log(res.data);
            } catch (e) {
                console.log(e);
            }

        } else if (indexSeen) {
            this.setState({ invalidIndex: true })
        }
    }

    render() { 
        const {seenIndexes, seenValues, invalidIndex} = this.state;
        return ( <div>
            <h1>Fibonacci Master</h1>
            <form onSubmit={this.handleSubmit}>
                <label>Calculate fibonacci number with index: </label>
                <input type="number" value={this.state.indexToSubmit || ""} onChange={this.handleInputChange}/>
                <button type="submit">Submit</button>
                <div>
                    {invalidIndex && <small color="red">Index has been submitted already</small>}
                </div>
            </form>

            <div>
                <p>All the indexes has been calculated by others: </p>
                {seenIndexes.length ? seenIndexes.toString() : 'No indexes'}
            </div>

            <div>
                <p>Here are the results:</p>
                {Object.keys(seenValues).length ? (
                    Object.keys(seenValues).map(key => (
                        <li key={key}>Fib({key}) === {seenValues[key]}</li>
                    ))
                ) : 'No results'}
            </div>
            </div> );
    }
}
 
export default Fib;