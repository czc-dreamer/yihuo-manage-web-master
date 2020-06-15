<template>
  <v-stepper v-model="step">
    <v-stepper-items>
      <v-stepper-content step="1" style="height: 600px">
        <v-form v-model="valid" ref="basic" style="height:700px">
          <v-layout class="justify-center">
            <v-flex xs12>
              <v-layout row>
                <v-flex xs5>
                  <v-cascader
                    url="/item/categoryT/list"
                    showAllLevels
                    required
                    v-model="goods.cid"
                    label="请选择商品分类"
                  />
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-text-field
            label="商品标题"
            v-model="goods.title"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="商品详情"
            v-model="goods.detail"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="购入价格"
            v-model="goods.buy_price"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="出售价格"
            v-model="goods.sell_price"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-card flat>
            <v-card-title>
              <h4>上传图片</h4>
            </v-card-title>
            <v-card-text>
              <v-upload
                ref="image_url"
                v-model="goods.image"
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
  name: "MyGoodsForm",
  data() {
    return {
      editorOption: {
        // 富文本编辑器配置
        placeholder: "编写商品描述信息，让客户了解你的商品"
      },
      valid: false, //数据校验
      goods: {
        cid: "",
        name: "",
        title: "", //标题
        detail: "",
        image: "",
        buy_price: "",
        sell_price: "",
        user_id: ""
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
          console.log("1:" + this.goods.image);
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
      this.verify()
        .then(data => {
          var uid=data.id
          if (this.isEdit) {
            var goodsInfo = {
              id: this.oldGoods.id,
              title: this.goods.title,
              image: this.goods.image[0],
              detail: this.goods.detail,
              buy_price: this.goods.buy_price * 100,
              sell_price: this.goods.sell_price * 100,
              cid: this.goods.cid[1].id
            };
            console.log("nim"+this.goods.cid[1].id);
            this.$http({
              url: "/item/seconds",
              method: "put",
              data: JSON.stringify(goodsInfo) 
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
          }else{
            console.log("nwuyu")
            var goodsInfo2 = {
              user_id:uid,
              title: this.goods.title,
              image: this.goods.image[0],
              detail: this.goods.detail,
              buy_price: this.goods.buy_price * 100,
              sell_price: this.goods.sell_price * 100,
              cid: this.goods.cid
            };
            console.log("nim");
            this.$http({
              url: "/item/seconds",
              method: "post",
              data: goodsInfo2
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
          };
        })
        .catch(() => {
          // this.$router.push("/login");
        });
    },
    clear() {
      //清空表单
      //this.oldGoods = {};
      this.goods.categories = [];
      this.goods.title = "";
      this.goods.detail = "";
      this.goods.image = "";
      this.goods.buy_price = "";
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
