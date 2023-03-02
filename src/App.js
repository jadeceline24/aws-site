import {useEffect, useState} from 'react';
import './App.css';
import {Amplify, API, graphqlOperation} from 'aws-amplify';
import awsExports from './aws-exports';
import {updateDoge} from './graphql/mutations';
import {getDoge} from './graphql/queries';
Amplify.configure(awsExports);

function App() {
  const [doge, setdoge] = useState(0);

  async function fetchPrice() {
    try {
      const dogeData = await API.graphql(graphqlOperation(getDoge));
      const dogPrice = dogeData.data.getDoge.price;
      setdoge(dogPrice);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchPrice();
  }, []);
  async function updatePrice() {
    try {
      const dogeData2 = await API.graphql(graphqlOperation(getDoge));
      const updatedogPrice = dogeData2.data.getDoge.price + 0.1;
      const update = await API.graphql(
        graphqlOperation(updateDoge, {input: updatedogPrice}),
      );
      setdoge(update.data.updateDoge.price);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="App">
      <h1>Connect Serverless</h1>
      <h2>Price: ${doge.toFixed(2)}</h2>
      <button onClick={() => updatePrice()}>Add</button>
    </div>
  );
}

export default App;
