<template>
  <v-stepper v-model="step">
    <v-stepper-items>
      <v-stepper-content step="1" style="height: 600px">
        <v-form v-model="valid" ref="basic" style="height:700px">
          <v-text-field
            label="订单编号"
            v-model="order.orderDetails[0].orderId"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="商品标题"
            v-model="order.orderDetails[0].title"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="商品详情"
            v-model="order.orderDetails[0].ownSpec"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="商品价格"
            v-model="order.orderDetails[0].price"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="订单状态"
            v-model="order.status"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-card flat>
                  <v-card-title><h4>上传图片</h4></v-card-title>
                  <v-card-text>
                    <v-upload ref="image_url"
                              v-model="order.orderDetails[0].image"
                              url="/upload/image"
                              :multiple="true"
                              :pic-width="250"
                              :pic-height="250"
                    />
                  </v-card-text>
                </v-card>
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
  name: "OrderForm",
  data() {
    return {
      editorOption: {
        // 富文本编辑器配置
        placeholder: "编写商品描述信息，让客户了解你的商品"
      },
      valid: false, //数据校验
      order: [],
      count: 0, //文本框的数量
      loading3: false,
      loader: null,
    //   isEdit:false,
      oldData: []
    };
  },
  props: {
    oldOrder: {
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
    oldOrder: {
      deep: true,
      handler(val) {
        if (val !== null) {
          this.order = Object.deepCopy(val);
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
      var orderInfo = {
        orderId:this.order.orderDetails[0].orderId,
        status:this.order.status,
        price:this.order.orderDetails[0].price
      };

      this.verify()
        .then(data => {
          this.orderInfo = data.id;
          this.$http({
            url: "/order/",
            method: this.isEdit ? "put" : "post",
            data: orderInfo
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
      this.order.status="";
      this.order.orderDetails[0].title="";
      this.order.orderDetails[0].orderId="";
      this.order.orderDetails[0].ownSpec="";
      this.order.orderDetails[0].price="";
    }
  },
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
