import axios from 'axios'

const getURLResponse = async (url) => {
  let response;

  try {
    response = await axios.get(url);
  } catch (error) {
    if (error.response) return response = error.response;
    if (error.code) return response = { status: error.code }

    response = { status: '?' }
  }

  return response;
}

export default getURLResponse;