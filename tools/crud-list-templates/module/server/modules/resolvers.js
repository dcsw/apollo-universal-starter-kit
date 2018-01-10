import { withFilter } from 'graphql-subscriptions';

const XXXX_SUBSCRIPTION = 'xxxx_subscription';
const XXXXS_SUBSCRIPTION = 'xxxxs_subscription';

export default pubsub => ({
  Query: {
    async xxxxs(obj, { limit, after }, context) {
      let edgesArray = [];
      let xxxxs = await context.Xxxx.xxxxsPagination(limit, after);

      xxxxs.map(xxxx => {
        edgesArray.push({
          cursor: xxxx.id,
          node: {
            id: xxxx.id,
            title: xxxx.title,
            content: xxxx.content
          }
        });
      });

      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      const values = await Promise.all([context.Xxxx.getTotal(), context.Xxxx.getNextPageFlag(endCursor)]);

      return {
        totalCount: values[0].count,
        edges: edgesArray,
        pageInfo: {
          endCursor: endCursor,
          hasNextPage: values[1].count > 0
        }
      };
    },
    xxxx(obj, { id }, context) {
      return context.Xxxx.xxxx(id);
    }
  },
  Mutation: {
    async addXxxx(obj, { input }, context) {
      const [id] = await context.Xxxx.addXxxx(input);
      const xxxx = await context.Xxxx.xxxx(id);
      // publish for xxxx list
      pubsub.publish(XXXXS_SUBSCRIPTION, {
        xxxxsUpdated: {
          mutation: 'CREATED',
          id,
          node: xxxx
        }
      });
      return xxxx;
    },
    async deleteXxxx(obj, { id }, context) {
      const xxxx = await context.Xxxx.xxxx(id);
      const isDeleted = await context.Xxxx.deleteXxxx(id);
      if (isDeleted) {
        // publish for xxxx list
        pubsub.publish(XXXXS_SUBSCRIPTION, {
          xxxxsUpdated: {
            mutation: 'DELETED',
            id,
            node: xxxx
          }
        });
        return { id: xxxx.id };
      } else {
        return { id: null };
      }
    },
    async editXxxx(obj, { input }, context) {
      await context.Xxxx.editXxxx(input);
      const xxxx = await context.Xxxx.xxxx(input.id);
      // publish for xxxx list
      pubsub.publish(XXXXS_SUBSCRIPTION, {
        xxxxsUpdated: {
          mutation: 'UPDATED',
          id: xxxx.id,
          node: xxxx
        }
      });
      // publish for edit xxxx page
      pubsub.publish(XXXX_SUBSCRIPTION, { xxxxUpdated: xxxx });
      return xxxx;
    },
  },
  Subscription: {
    xxxxUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(XXXX_SUBSCRIPTION),
        (payload, variables) => {
          return payload.xxxxUpdated.id === variables.id;
        }
      )
    },
    xxxxsUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(XXXXS_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.xxxxsUpdated.id;
        }
      )
    },
  }
});