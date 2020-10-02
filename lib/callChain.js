import Spinnies from 'spinnies';
import getURLResponse from './getURLResponse';

const spinnies = new Spinnies();

const callChain =  (projects) => {
  Object.entries(projects).map(async ([ name, options ]) => {
    spinnies.add(name, { text: name, color: 'gray' });
  
    try {      
      const response = await getURLResponse(options.url);
      return {
        name,
        options,
        response
      };
    } catch (error) {
      return error;
    }
  })
};

export default callChain;