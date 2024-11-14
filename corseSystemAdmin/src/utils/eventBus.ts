import { ref, Ref } from 'vue';
import mitt from 'mitt';

const emitter = mitt();
const audioInstance: Ref<HTMLAudioElement | null> = ref(null);

export { emitter, audioInstance };
