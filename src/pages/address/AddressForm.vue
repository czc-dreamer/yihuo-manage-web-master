<template>
  <v-stepper v-model="step">
    <v-stepper-items>
      <v-stepper-content step="1" style="height: 600px">
        <v-form v-model="valid" ref="basic" style="height:700px">
          <v-text-field
            label="姓名"
            v-model="addr.name"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="手机号"
            v-model="addr.phone"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="邮编"
            v-model="addr.zipCode"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field label="省" v-model="addr.state" :counter="200" :rules="[v => !!v]" required />
          <v-text-field label="市" v-model="addr.city" :counter="200" :rules="[v => !!v]" required />
          <v-text-field
            label="县"
            v-model="addr.district"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="详细地址"
            v-model="addr.address"
            :counter="200"
            :rules="[v => !!v]"
            required
          />
          <v-text-field
            label="默认地址"
            v-model="addr.defaultAddress"
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
  name: "AddressForm",
  data() {
    return {
      editorOption: {
        // 富文本编辑器配置
        placeholder: "编写商品描述信息，让客户了解你的商品"
      },
      valid: false, //数据校验
      addr: {
        name: "", //收货人
        phone: "", //收货人电话
        zipCode: "", //收货人邮编
        state: "", //省份
        city: "", //市
        district: "", // 区/县
        address: "", //详细地址
        label: "", //标签
        defaultAddress: false //是否为默认地址
      },
      count: 0, //文本框的数量
      loading3: false,
      loader: null,
      //   isEdit:false,
      oldData: []
    };
  },
  props: {
    oldAddress: {
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
    oldAddress: {
      deep: true,
      handler(val) {
        if (val !== null) {
          this.addr = Object.deepCopy(val);
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
      var addressInfo = {
        name: this.addr.name,
        phone: this.addr.phone,
        zipCode: this.addr.zipCode,
        state: this.addr.state,
        city: this.addr.city,
        district: this.addr.district,
        address:this.addr.address,
        defaultAddress: this.addr.defaultAddress,
        label:this.addr.label
      };
      this.verify()
        .then(data => {
          this.$http({
            url: "/address",
            method: this.isEdit ? "put" : "post",
            data: addressInfo
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
      (this.addr.user_id = ""),
        (this.addr.name = ""),
        (this.addr.phone = ""),
        (this.addr.zip_code = ""),
        (this.addr.state = ""),
        (this.addr.city = ""),
        (this.addr.district = ""),
        (this.addr.default_address = "");
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
