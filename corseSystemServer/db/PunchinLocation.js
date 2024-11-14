const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

const PunchinLocationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
});
PunchinLocationSchema.plugin(softDeletePlugin);
const PunchinLocation = mongoose.model('PunchinLocation', PunchinLocationSchema);

module.exports = PunchinLocation;
