const ServiceLog = require('../models/ServiceLog');

const predictWaitTime = async (queueId) => {
  //fetch last 10 logs
  const logs = await ServiceLog.find({queueId})
            .sort({createdAt: -1})
            .limit(10);
  if(logs.length == 0) return 0;
  // 2. average nikalo actualServiceTime ka
  const totalServiceTime = logs.reduce((acc,log)=>acc+log.actualServiceTime, 0);
  const avgServiceTime = totalServiceTime/logs.length;
  return avgServiceTime;
};

module.exports = predictWaitTime;