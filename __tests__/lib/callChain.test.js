import callChain from '../../lib/callChain';
import projects from '../../__mocks__/projects.json';

describe('Should pass all callChain.js tests', () => {
    it('Should return right response from calling', () => {
        const chain = callChain(projects);
        console.log(chain)
    })
});