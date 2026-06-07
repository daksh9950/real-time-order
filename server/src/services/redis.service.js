let publisherClient = null;

const setPublisher = (client) => {
  publisherClient = client;
};

const publishOrderChange = async (payload) => {
  if (!publisherClient) return;
  await publisherClient.publish('order_changes', JSON.stringify(payload));
};

module.exports = { setPublisher, publishOrderChange };
