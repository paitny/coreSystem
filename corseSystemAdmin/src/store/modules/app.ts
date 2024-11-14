import { getLocal, setLocal } from "../../utils/storage";
import getRoutePool from "../../assets/ts/handleData";

interface State {
    sidebarOpened: boolean;
    tagsViewList: any[]; // 假设 tagsViewList 里面的元素是任意类型
}

export default {
    namespaced: true,
    state: (): State => {
        return {
            sidebarOpened: getLocal("sidebarOpened", true), // 设置默认值为 false
            tagsViewList: getLocal('tagsViewList', [])
        };
    },
    actions: {
        addTagsViewList(context: any, tag: any) {
            const routePool = getRoutePool();

            const isFindRoute = routePool.find((item: any) => item.path === tag.path);
            if (!isFindRoute) return;
            const isFindTag = context.state.tagsViewList.find((item: any) => item.path === tag.path);

            if (!isFindTag) {
                const arr = [...context.state.tagsViewList, tag]; // 使用展开运算符创建新数组
                setLocal('tagsViewList', arr);
                context.commit('storeTagsViewList', arr);

            }
        },
        removeTagsViewList(context: any, { type, index }: { type: string, index: number }) {
            let arr = [...context.state.tagsViewList]; // 使用展开运算符创建新数组

            switch (type) {
                case 'index':
                    arr.splice(index, 1);
                    break;
                case 'other':
                    arr.splice(index, 1);
                    break;
                case 'right':
                    arr.splice(index + 1);
                    break;
            }
            setLocal('tagsViewList', arr);
            context.commit('storeTagsViewList', arr);
        }
    },
    mutations: {
        changeSidebarOpened(state: State) {
            state.sidebarOpened = !state.sidebarOpened;
            setLocal("sidebarOpened", state.sidebarOpened);
        },
        storeTagsViewList(state: State, list: any[]) { // 假设 tagsViewList 里面的元素是任意类型
            state.tagsViewList = list;
        }
    }
};
