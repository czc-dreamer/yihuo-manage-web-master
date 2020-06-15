<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="addAddress">新增地址</v-btn>
      <v-btn color="error" @click="deleteAllAddress">全部删除</v-btn>
      <v-spacer />
      <v-text-field
        label="输入关键字搜索"
        class="flex sm3"
        append-icon="search"
        v-model.lazy="filter.search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="addressList"
      :pagination.sync="pagination"
      :total-items="totalAddress"
      :loading="loading"
      class="elevation-10"
      select-all
      v-model="selected"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">
          <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
        </td>
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.user_id }}</td>
        <td class="text-xs-center">{{ props.item.name}}</td>
        <td class="text-xs-center">{{ props.item.phone}}</td>
        <td class="text-xs-center">{{ props.item.zip_code}}</td>
        <td class="text-xs-center">{{ props.item.state}}</td>
        <td class="text-xs-center">{{ props.item.city}}</td>
        <td class="text-xs-center">{{ props.item.district}}</td>
        <td class="text-xs-center" v-if="props.item.default_address">是</td>
        <td class="text-xs-center" v-else>否</td>
        <!-- <td class="text-xs-center">{{ props.item.bname }}</td> -->
        <td class="justify-center layout">
          <v-btn icon small @click="editAddress(props.item)">
            <i class="el-icon-edit" />
          </v-btn>
          <v-btn icon small @click="deleteItem(props.item.id)">
            <i class="el-icon-delete" />
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">对不起，没有查询到任何数据 :(</v-alert>
      </template>
      <template
        slot="pageText"
        slot-scope="props"
      >共{{props.itemsLength}}条,当前:{{ props.pageStart }} - {{ props.pageStop }}</template>
    </v-data-table>
    <v-dialog max-width="800" max-height v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}用户</v-toolbar-title>
          <v-spacer />
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height: 600px">
          <address-form
            @initStep="initStep"
            @close="close"
            :isEdit="isEdit"
            :oldAddress="oldAddress"
            :step="step"
            :show="show"
            ref="userForm"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>>
<script>
import AddressForm from "./AddressForm";
export default {
  name: "address",
  data() {
    return {
      totalAddress: 0, //总条数
      addressList: [], //当前页品牌数据
      loading: true, //是否在加载中
      headers: [
        // 表头
        { text: "id", align: "center", value: "id", sortable: true },
        { text: "用户ID", align: "center", sortable: false, value: "user_id" },
        { text: "姓名", align: "center", sortable: false, value: "name" },
        // {text: '品牌', align: 'center', value: 'brand', sortable: false,},
        {
          text: "手机号码",
          align: "center",
          sortable: false,
          value: "phone"
        },
        {
          text: "邮编",
          align: "center",
          sortable: false,
          value: "zip_code"
        },
        {
          text: "省",
          align: "center",
          sortable: false,
          value: "state"
        },
        {
          text: "城市",
          align: "center",
          sortable: false,
          value: "city"
        },
        {
          text: "县",
          align: "center",
          sortable: false,
          value: "district"
        },
        {
          text: "是否默认地址",
          align: "center",
          sortable: false,
          value: "default_address"
        },
        { text: "操作", align: "center", sortable: false }
      ],
      show: false, //控制对话框的显示
      // seckill_show:false, //秒杀对话框显示
      oldAddress: {}, //即将编辑的商品信息
      // seckill_goods_message:{}, //秒杀商品信息
      isEdit: false, //是否被编辑
      selected: [], //选择的条目
      pagination: {}, //分页信息
      filter: {
        search: "" //搜索过滤字段
      },
      step: 1 //子组件中的步骤索引，初始为1
    };
  },
  watch: {
    pagination: {
      deep: true,
      handler() {
        this.getDataFromServer();
      }
    },
    filter: {
      deep: true,
      handler() {
        this.getDataFromServer();
      }
    }
  },
  created() {
    this.verify()
      .then(() => {
        this.getDataFromServer();
      })
      .catch(() => {
        this.$router.push("/login");
      });
  },
  methods: {
    close() {
      this.show = false;
      //重新获取数据
      this.getDataFromServer();
      //初始化弹窗
      this.step = 1;
    },
    initStep() {
      this.step = 1;
    },
    getDataFromServer() {
      //从服务器加载数据

      // 开启进度条
      this.loading = true;

      //发起ajax请求
      // 分页查询page,rows,key,sortBy,desc

      this.$http
        .get("/address/list", {
          params: {
            page: this.pagination.page, //当前页
            rows: this.pagination.rowsPerPage, //每页大小
            sortBy: this.pagination.sortBy, //排序字段
            desc: this.pagination.descending, //是否降序
            key: this.filter.search //搜索条件
          }
        })
        .then(resp => {
          this.addressList = resp.data.items;
          this.totalAddress = resp.data.total;
          //关闭进度条
          this.loading = false;
        });
    },
    addAddress() {
      //修改标记
      this.isEdit = false;
      //控制弹窗可见
      this.show = true;
      //把oldUser变为null
      this.oldAddress = null;
    },
    deleteAllAddress() {
      const deleteUserId = this.selected.map(s => {
        return s.id;
      });

      if (deleteUserId.length > 0) {
        this.verify()
          .then(() => {
            this.$message
              .confirm("全部删除，不可恢复！")
              .then(() => {
                this.$http
                  .delete("/address/" + deleteUserId.join("-"))
                  .then(() => {
                    this.getDataFromServer();
                    this.selected = [];
                  })
                  .catch(() => {
                    this.$message.error("删除失败！");
                  });
              })
              .catch(() => {
                this.$message.info("删除取消！");
              });
          })
          .catch(() => {
            this.$router.push("/login");
          });
      } else {
        this.$message.info("选中后再进行操作！");
      }
    },
    closeWindow() {
      this.oldUser = null;
      //重新加载数据
      this.getDataFromServer();
      //关闭窗口
      this.show = false;
    },
    lastStep() {
      if (this.step > 1) {
        this.step--;
      }
    },
    nextStep() {
      if (this.$refs.goodsForm.$refs.basic.validate() && this.step < 4) {
        this.step++;
      }
    },
    deleteItem(id) {
      const selectId = this.selected.map(s => {
        return s.id;
      });
      if (selectId.length === 1 && selectId[0] === id) {
        this.verify()
          .then(() => {
            this.$http
              .delete("/address/" + selectId)
              .then(() => {
                this.getDataFromServer();
                this.selected = [];
              })
              .catch(() => {
                this.$message.error("删除失败！");
              });
          })
          .catch(() => {
            // this.$router.push("/login");
          });
      } else {
        this.$message.info("选中后再进行操作！");
      }
    },
    editAddress(oldAddress) {
      //console.log(oldUser);
      this.oldAddress = oldAddress;
      //构造商品分类
      this.$http
        .get("address/" + oldAddress.id)
        .then(({ data }) => {
          this.isEdit = true;

          //显示弹窗
          this.show = true;
        })
        .catch();
    }
  },
  components: {
    AddressForm
  }
};
</script>

<style scoped>
</style>
