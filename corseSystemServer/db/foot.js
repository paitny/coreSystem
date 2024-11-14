const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const softDeletePlugin = require('../utils/softDeletePlugin'); // 引入软删除插件

const footSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    newsId: { type: Schema.Types.ObjectId, required: true },
    isDeleted: { type: Boolean, default: false }, // 用于软删除的标志
    deletedAt: {
        type: Date,
        default: null,  // 允许为 null
        required: false // 可选字段
    },
    timestamp: { type: Date, default: Date.now }
});
footSchema.plugin(softDeletePlugin);
footSchema.index({ userId: 1, newsId: 1 }, { unique: true }); // Ensure uniqueness

module.exports = mongoose.model('foot', footSchema);
