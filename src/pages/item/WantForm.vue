<template>
  <v-stepper v-model="step">
    <v-stepper-items>
      <v-stepper-content step="1" style="height: 600px">
        <v-form v-model="valid" ref="basic" style="height:700px">
          <v-text-field
            label="商品标题"
            v-model="goods.title"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="商品详情"
            v-model="goods.content"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="期望价格"
            v-model="goods.sell_price"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="期望交易地点"
            v-model="goods.trade_place"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-divider></v-divider>
          
        </v-form>
      </v-stepper-content>
    </v-stepper-items>
    <v-layout class="pt-3">
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="clear">清空</v-btn>
      <v-btn color="blue darken-1" flat @click="submit">保存</v-btn>
    </v-layout>
  </v-stepper>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  name: "WantForm",
  data() {
    return {
      editorOption: {
        // 富文本编辑器配置
        placeholder: "编写商品描述信息，让客户了解你的商品"
      },
      valid: false, //数据校验
      goods: {
        title: "", //标题
        content: "",
        sell_price: ""
      },
      count: 0, //文本框的数量
      loading3: false,
      loader: null,
      //isEdit:false,
      oldData: []
    };
  },
  props: {
    oldGoods: {
      type: Object
    },
    step: {
      type: Number,
      default: 1
    },
    show: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 2000);

      this.loader = null;
    },
    oldGoods: {
      deep: true,
      handler(val) {
        if (val !== null) {
          this.goods = Object.deepCopy(val);
          this.isEdit = true;
        } else {
          this.clear();
        }
      }
    }
  },
  components: {
    quillEditor
  },
  computed: {},
  methods: {
    submit() {
      var goodsInfo = {
          id:this.oldGoods.id,
        user_id: this.oldGoods.user_id,
        title: this.goods.title,
        content: this.goods.content,
        sell_price: this.goods.sell_price * 100,
        trade_place:this.goods.trade_place
      };
console.log(goodsInfo.image)
      this.verify()
        .then(data => {
          this.goodsInfo = data.id;
          this.$http({
            url: "/item/want",
            method: this.isEdit ? "put" : "post",
            data: goodsInfo
          })
            .then(() => {
              //成功，关闭窗口
              setTimeout(() => {
                this.$emit("close");
                this.$message.success("保存成功！");
                this.clear();
              }, 2000);
            })
            .catch(() => {
              this.$message.error("保存失败！");
            });
        })
        .catch(() => {
          // this.$router.push("/login");
        });
    },
    clear() {
      //清空表单
      this.goods.title = "";
      this.goods.content = "";
      this.goods.trade_place = "";
      this.goods.sell_price = "";
    }
  }
};
</script>

<style scoped>
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
