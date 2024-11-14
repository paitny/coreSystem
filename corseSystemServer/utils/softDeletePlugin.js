module.exports = function softDeletePlugin(schema) {
    // 添加 `isDeleted` 和 `deletedAt` 字段
    schema.add({
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null }
    });

    // 定义软删除方法
    schema.methods.softDelete = async function () {
        this.isDeleted = true;
        this.deletedAt = new Date();  // 设置删除时间
        await this.save();
    };

    // 中间件拦截所有删除操作并转化为软删除
    const softDeleteMiddleware = async function (next) {
        const now = new Date();
        await this.model.updateMany(this.getFilter(), {
            isDeleted: true,
            deletedAt: now  // 更新删除时间
        });
        next();
    };

    // 监听所有删除操作，将其改为软删除
    schema.pre('deleteOne', softDeleteMiddleware);
    schema.pre('deleteMany', softDeleteMiddleware);
    schema.pre('findOneAndDelete', softDeleteMiddleware);
    schema.pre('findByIdAndDelete', softDeleteMiddleware);
    schema.pre('findOneAndRemove', softDeleteMiddleware);
    schema.pre('findByIdAndRemove', softDeleteMiddleware);
    schema.pre('remove', softDeleteMiddleware);

    // 查询过滤：只返回未被软删除的文档
    schema.pre(/^find/, function (next) {
        this.where({ isDeleted: false });
        next();
    });

    // 聚合过滤：只返回未被软删除的文档
    schema.pre('aggregate', function (next) {
        const firstStage = this.pipeline()[0];

        // 如果第一个聚合阶段是 $match，则追加条件到 $match
        if (firstStage && firstStage.$match) {
            firstStage.$match.isDeleted = { $ne: true };
        } else {
            // 否则，在聚合管道开头插入 $match 阶段
            this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
        }

        next();
    });

    // `countDocuments` 过滤：只统计未被软删除的文档
    schema.pre('countDocuments', function (next) {
        this.where({ isDeleted: false });
        next();
    });
};
