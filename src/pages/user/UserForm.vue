<template>
  <v-stepper v-model="step">
    <v-stepper-items>
      <v-stepper-content step="1" style="height: 600px">
        <v-form v-model="valid" ref="basic" style="height:700px">
          <v-text-field
            label="用户名"
            v-model="user.username"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="密码"
            v-model="user.password"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="手机号"
            v-model="user.phone"
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
                v-model="user.head"
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
  name: "UserForm",
  data() {
    return {
      editorOption: {
        // 富文本编辑器配置
        placeholder: "编写商品描述信息，让客户了解你的商品"
      },
      valid: false, //数据校验
      user: {
        id: "",
        username: "",
        password: "",
        phone: "",
        head: ""
      },
      count: 0, //文本框的数量
      loading3: false,
      loader: null,
      //   isEdit:false,
      oldData: []
    };
  },
  props: {
    oldUser: {
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
    oldUser: {
      deep: true,
      handler(val) {
        if (val !== null) {
          this.user = Object.deepCopy(val);
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
          if (this.isEdit) {
            console.log("nb");
            var userInfo = {
              id: this.user.id,
              username: this.user.username,
              password: this.user.password,
              phone: this.user.phone,
              head: this.user.head[0]
            };
            this.$http({
              url: "/user",
              method: "put",
              data: userInfo
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
          } else {
            console.log("vb");
            var userInfo2 = {
              username: this.user.username,
              password: this.user.password,
              phone: this.user.phone,
              head: this.user.head[0]
            };
            this.$http({
              url: "/user",
              method: "post",
              data: userInfo2
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
          }
        })
        .catch(() => {
          // this.$router.push("/login");
        });
    },
    clear() {
      //清空表单
      this.user.username = "";
      this.user.password = "";
      this.user.phone = "";
      this.user.image = "";
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
