<template>
  <h1>我们联合！</h1>
  <h2>输入</h2>
  <textarea v-model="input" class="input" />
  <h2>输出</h2>
  <textarea v-model="strParsedResult" class="output" :rows="4" :cols="50" readonly></textarea>
  <div class="container">
    <div v-for="(arr, i) in parsedResult" :key="i" class="sub-container">
      <img
        v-for="(name, j) in arr"
        :key="j"
        :src="bgMap[name]"
        :style="{
          transform: `translateY(-${j * 3}px) rotate(${randomAngles[i][j]})`,
          'z-index': arr.length - j,
        }"
        :alt="name"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, customRef, triggerRef, watch, shallowRef, watchEffect } from "vue";
import { SVGTextToDataURL } from "./utils";
import parse from "../src";
import bread from "./assets/bread.svg?raw";
import cheese from "./assets/cheese.svg?raw";


type BreadAndCheese = ("面包" | "芝士")[];

interface ParsedResult {
    type: '和' | '夹' | 'N' | '面包' | '芝士';
    text: string;
    array: BreadAndCheese | BreadAndCheese[];
}

const bgMap = ref({
    面包: SVGTextToDataURL(bread),
    芝士: SVGTextToDataURL(cheese),
});

const input = ref("两面包夹芝士");

const error = ref<string | null>(null)

const strParsedResult = computed(() => {
    return JSON.stringify(parsedResult.value)
});

let lastParsedResult: ParsedResult['array'] = parse(input.value).array;
const parsedResult = customRef<BreadAndCheese[]>((track, trigger) => ({
    get() {
        try {
            lastParsedResult = parse(input.value).array
        } catch (e) {
            console.log(e);
        }
        track();
        const parsed = ((x: any): x is BreadAndCheese => typeof x[0] === 'string')(lastParsedResult)
            ? [lastParsedResult]
            : lastParsedResult;
        return parsed;
    },
    set(newValue) {
        lastParsedResult = newValue;
        trigger();
    },
}))
watch(input, () => {
    triggerRef(parsedResult);
})

const randomAngles = shallowRef<string[][]>([[]])
watchEffect(() => {
    const arr = parsedResult.value
    for (let i = 0; i < arr.length; i++) {
        if (!randomAngles.value[i]) randomAngles.value[i] = [];
        const len = arr[i].length;
        for (let j = 0; j < len; j++) {
            if (!randomAngles.value[i][j]) randomAngles.value[i][j] = `${['+', '-'][+(Math.random() > 0.5)]}${(Math.random() * 45)}deg`;
        }
        randomAngles.value[i].splice(len, Infinity);
    }
    randomAngles.value.splice(arr.length, Infinity);
    triggerRef(randomAngles);
})

</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.input {
  display: flex;
  margin-bottom: 10px;
}

.output {
  display: flex;
}

.container {
  display: flex;
  flex-direction: column;
  width: 500px;
  max-width: 100vw;
  height: 50vh;
  justify-content: center;
  align-items: center;
  .sub-container {
    display: flex;
    flex-direction: row;
    // height: 100%;
    // justify-content: flex-end;
    align-items: flex-start;
    // justify-content: flex-end;
    img {
      margin-right: -90px;
      height: 100px;
      width: 100px;
      // height: 100%;
    }
  }
}
</style>
