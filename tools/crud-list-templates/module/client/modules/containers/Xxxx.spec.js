import { expect } from 'chai';
import { step } from 'mocha-steps';
import _ from 'lodash';

import Renderer from '../../../../client/testHelpers/Renderer';
import XXXXS_SUBSCRIPTION from '../graphql/XxxxsSubscription.graphql';
import XXXX_SUBSCRIPTION from '../graphql/XxxxSubscription.graphql';
import DESCRIPTION_SUBSCRIPTION from '../graphql/DescriptionSubscription.graphql';

const createNode = id => ({
  id: `${id}`,
  title: `Xxxx title ${id}`,
  content: `Xxxx content ${id}`,
  descriptions: [
    { id: id * 1000 + 1, content: 'Xxxx description 1', __typename: 'Description' },
    { id: id * 1000 + 2, content: 'Xxxx description 2', __typename: 'Description' }
  ],
  __typename: 'Xxxx'
});

const mutations = {
  editXxxx: true,
  addDescription: true,
  editDescription: true
};

const mocks = {
  Query: () => ({
    xxxxs(ignored, { after }) {
      const totalCount = 4;
      const edges = [];
      for (let i = +after + 1; i <= +after + 2; i++) {
        edges.push({
          cursor: i,
          node: createNode(i),
          __typename: 'XxxxEdges'
        });
      }
      return {
        totalCount,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: true,
          __typename: 'XxxxPageInfo'
        },
        __typename: 'Xxxxs'
      };
    },
    xxxx(obj, { id }) {
      return createNode(id);
    }
  }),
  Mutation: () => ({
    deleteXxxx: (obj, { id }) => createNode(id),
    deleteDescription: (obj, { input }) => input,
    ...mutations
  })
};

describe('Xxxxs and descriptions example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let content;

  beforeEach(() => {
    // Reset spy mutations on each step
    Object.keys(mutations).forEach(key => delete mutations[key]);
    if (app) {
      app.update();
      content = app.find('#content').last();
    }
  });

  step('Xxxxs page renders without data', () => {
    app = renderer.mount();
    content = app.find('#content').last();
    renderer.history.push('/xxxxs');

    content.text().should.equal('Loading...');
  });

  step('Xxxxs page renders with data', () => {
    expect(content.text()).to.include('Xxxx title 1');
    expect(content.text()).to.include('Xxxx title 2');
    expect(content.text()).to.include('2 / 4');
  });

  step('Clicking load more works', () => {
    const loadMoreButton = content.find('#load-more').last();
    loadMoreButton.simulate('click');
  });

  step('Clicking load more loads more xxxxs', () => {
    expect(content.text()).to.include('Xxxx title 3');
    expect(content.text()).to.include('Xxxx title 4');
    expect(content.text()).to.include('4 / 4');
  });

  step('Check subscribed to xxxx list updates', () => {
    expect(renderer.getSubscriptions(XXXXS_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates xxxx list on xxxx delete from subscription', () => {
    const subscription = renderer.getSubscriptions(XXXXS_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        xxxxsUpdated: {
          mutation: 'DELETED',
          node: createNode(2),
          __typename: 'UpdateXxxxPayload'
        }
      }
    });

    expect(content.text()).to.not.include('Xxxx title 2');
    expect(content.text()).to.include('3 / 3');
  });

  step('Updates xxxx list on xxxx create from subscription', () => {
    const subscription = renderer.getSubscriptions(XXXXS_SUBSCRIPTION)[0];
    subscription.next(
      _.cloneDeep({
        data: {
          xxxxsUpdated: {
            mutation: 'CREATED',
            node: createNode(2),
            __typename: 'UpdateXxxxPayload'
          }
        }
      })
    );

    expect(content.text()).to.include('Xxxx title 2');
    expect(content.text()).to.include('4 / 4');
  });

  step('Clicking delete optimistically removes xxxx', () => {
    mutations.deleteXxxx = (obj, { id }) => {
      return createNode(id);
    };

    const deleteButtons = content.find('.delete-button');
    expect(deleteButtons).has.lengthOf(12);
    deleteButtons.last().simulate('click');

    expect(content.text()).to.not.include('Xxxx title 4');
    expect(content.text()).to.include('3 / 3');
  });

  step('Clicking delete removes the xxxx', () => {
    expect(content.text()).to.include('Xxxx title 3');
    expect(content.text()).to.not.include('Xxxx title 4');
    expect(content.text()).to.include('3 / 3');
  });

  step('Clicking on xxxx works', () => {
    const xxxxLinks = content.find('.xxxx-link');
    xxxxLinks.last().simulate('click', { button: 0 });
  });

  step('Clicking on xxxx opens xxxx form', () => {
    const xxxxForm = content.find('form[name="xxxx"]');

    expect(content.text()).to.include('Edit Xxxx');
    expect(
      xxxxForm
        .find('[name="title"]')
        .last()
        .instance().value
    ).to.equal('Xxxx title 3');
    expect(
      xxxxForm
        .find('[name="content"]')
        .last()
        .instance().value
    ).to.equal('Xxxx content 3');
  });

  step('Check subscribed to xxxx updates', () => {
    expect(renderer.getSubscriptions(XXXX_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates xxxx form on xxxx updated from subscription', () => {
    const subscription = renderer.getSubscriptions(XXXX_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        xxxxUpdated: {
          id: '3',
          title: 'Xxxx title 203',
          content: 'Xxxx content 204',
          __typename: 'Xxxx'
        }
      }
    });
    const xxxxForm = content.find('form[name="xxxx"]');

    expect(
      xxxxForm
        .find('[name="title"]')
        .last()
        .instance().value
    ).to.equal('Xxxx title 203');
    expect(
      xxxxForm
        .find('[name="content"]')
        .last()
        .instance().value
    ).to.equal('Xxxx content 204');
  });

  step('Xxxx editing form works', done => {
    mutations.editXxxx = (obj, { input }) => {
      expect(input.id).to.equal(3);
      expect(input.title).to.equal('Xxxx title 33');
      expect(input.content).to.equal('Xxxx content 33');
      done();
      return input;
    };

    const xxxxForm = app.find('form[name="xxxx"]').last();
    xxxxForm
      .find('[name="title"]')
      .last()
      .simulate('change', { target: { value: 'Xxxx title 33' } });
    xxxxForm
      .find('[name="content"]')
      .last()
      .simulate('change', { target: { value: 'Xxxx content 33' } });
    xxxxForm.simulate('submit');
  });

  step('Check opening xxxx by URL', () => {
    renderer.history.push('/xxxx/3');
  });

  step('Opening xxxx by URL works', () => {
    const xxxxForm = content.find('form[name="xxxx"]');

    expect(content.text()).to.include('Edit Xxxx');
    expect(
      xxxxForm
        .find('[name="title"]')
        .at(0)
        .instance().value
    ).to.equal('Xxxx title 33');
    expect(
      xxxxForm
        .find('[name="content"]')
        .at(0)
        .instance().value
    ).to.equal('Xxxx content 33');
    expect(content.text()).to.include('Edit Xxxx');
  });

  step('Description adding works', done => {
    mutations.addDescription = (obj, { input }) => {
      expect(input.xxxxId).to.equal(3);
      expect(input.content).to.equal('Xxxx description 24');
      done();
      return input;
    };

    const descriptionForm = content.find('form[name="description"]');
    descriptionForm
      .find('[name="content"]')
      .last()
      .simulate('change', { target: { value: 'Xxxx description 24' } });
    descriptionForm.last().simulate('submit');
    expect(content.text()).to.include('Xxxx description 24');
  });

  step('Updates description form on description added got from subscription', () => {
    const subscription = renderer.getSubscriptions(DESCRIPTION_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        descriptionUpdated: {
          mutation: 'CREATED',
          id: 3003,
          xxxxId: 3,
          node: {
            id: 3003,
            content: 'Xxxx description 3',
            __typename: 'Description'
          },
          __typename: 'UpdateDescriptionPayload'
        }
      }
    });

    expect(content.text()).to.include('Xxxx description 3');
  });

  step('Updates description form on description deleted got from subscription', () => {
    const subscription = renderer.getSubscriptions(DESCRIPTION_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        descriptionUpdated: {
          mutation: 'DELETED',
          id: 3003,
          xxxxId: 3,
          node: {
            id: 3003,
            content: 'Xxxx description 3',
            __typename: 'Description'
          },
          __typename: 'UpdateDescriptionPayload'
        }
      }
    });
    expect(content.text()).to.not.include('Xxxx description 3');
  });

  step('Description deleting optimistically removes description', () => {
    const deleteButtons = content.find('.delete-description');
    expect(deleteButtons).has.lengthOf(9);
    deleteButtons.last().simulate('click');

    app.update();
    content = app.find('#content').last();
    expect(content.text()).to.not.include('Xxxx description 24');
    expect(content.find('.delete-description')).has.lengthOf(6);
  });

  step('Clicking description delete removes the description', () => {
    expect(content.text()).to.not.include('Xxxx description 24');
    expect(content.find('.delete-description')).has.lengthOf(6);
  });

  step('Description editing works', done => {
    mutations.editDescription = (obj, { input }) => {
      expect(input.xxxxId).to.equal(3);
      expect(input.content).to.equal('Edited description 2');
      done();
      return input;
    };

    const editButtons = content.find('.edit-description');
    expect(editButtons).has.lengthOf(6);
    editButtons.last().simulate('click');

    const descriptionForm = content.find('form[name="description"]');
    expect(
      descriptionForm
        .find('[name="content"]')
        .last()
        .instance().value
    ).to.equal('Xxxx description 2');
    descriptionForm
      .find('[name="content"]')
      .last()
      .simulate('change', { target: { value: 'Edited description 2' } });
    descriptionForm.last().simulate('submit');

    expect(content.text()).to.include('Edited description 2');
  });

  step('Clicking back button takes to xxxx list', () => {
    const backButton = content.find('#back-button');
    backButton.last().simulate('click', { button: 0 });
    app.update();
    content = app.find('#content').last();
    expect(content.text()).to.include('Xxxx title 3');
  });
});
