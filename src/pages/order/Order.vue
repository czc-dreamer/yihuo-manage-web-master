<template>
  <v-card>
    <v-card-title>
      <v-btn color="error" @click="deleteAllUser">全部删除</v-btn>
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
      :items="orders"
      :pagination.sync="pagination"
      :total-items="totalOrder"
      :loading="loading"
      class="elevation-10"
      select-all
      v-model="selected"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">
          <v-checkbox v-model="props.item.selected" primary hide-details></v-checkbox>
        </td>
        <td class="text-xs-center">{{ props.item.orderDetails[0].id }}</td>
        <td class="text-xs-center">{{ props.item.orderDetails[0].orderId }}</td>
        <td class="text-xs-center">
          <img :src="props.item.orderDetails[0].image" style="width:100px; height:130px" />
        </td>
        <td class="text-xs-center">{{ props.item.orderDetails[0].title}}</td>
        <td class="text-xs-center">{{ props.item.orderDetails[0].ownSpec}}</td>
        <td class="text-xs-center">{{ props.item.orderDetails[0].price}}</td>
        <td class="text-xs-center" v-if=" props.item.status==1">未付款</td>
        <td class="text-xs-center" v-if=" props.item.status==2">已付款，未发货</td>
        <td class="text-xs-center" v-if=" props.item.status==3">已发货，未确认</td>
        <td class="text-xs-center" v-if=" props.item.status==4">交易成功</td>
        <td class="text-xs-center" v-if=" props.item.status==5">交易关闭</td>
        <td class="text-xs-center" v-if=" props.item.status==6">未评价</td>
        <td class="text-xs-center">{{ props.item.createTime}}</td>
        <!-- <td class="text-xs-center">{{ props.item.bname }}</td> -->
        <td class="justify-center layout">
          <v-btn icon small @click="editOrder(props.item)">
            <i class="el-icon-edit" />
          </v-btn>
          <v-btn icon small @click="deleteItem(props.item.orderDetails[0].id)">
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
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}订单</v-toolbar-title>
          <v-spacer />
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height: 600px">
          <order-form
            @initStep="initStep"
            @close="close"
            :isEdit="isEdit"
            :oldOrder="oldOrder"
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
import OrderForm from "./OrderForm";
export default {
  name: "order",
  data() {
    return {
      totalOrder: 0, //总条数
      orders: [], //当前页品牌数据
      loading: true, //是否在加载中
      headers: [
        // 表头
        { text: "id", align: "center", value: "id", sortable: true },
        {
          text: "订单编号",
          align: "center",
          sortable: false,
          value: "orderId"
        },
        {
          text: "商品图片",
          align: "center",
          sortable: false,
          value: "image"
        },
        { text: "商品标题", align: "center", sortable: false, value: "title" },
        // {text: '品牌', align: 'center', value: 'brand', sortable: false,},
        {
          text: "商品详情",
          align: "center",
          sortable: false,
          value: "ownSpec"
        },
        {
          text: "商品价格",
          align: "center",
          sortable: false,
          value: "price"
        },
        {
          text: "订单状态",
          align: "center",
          sortable: false,
          value: "status"
        },
        {
          text: "下单时间",
          align: "center",
          sortable: false,
          value: "createTime"
        },
        { text: "操作", align: "center", sortable: false }
      ],
      show: false, //控制对话框的显示
      // seckill_show:false, //秒杀对话框显示
      oldOrder: {}, //即将编辑的商品信息
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
        .get("/order/list/", {
          quey: {
            status: 0,
            page: 1,
            rows: 5
          }
        })
        .then(resp => {
          this.orders = resp.data.items;
          this.totalOrder = resp.data.total;
          //关闭进度条
          this.loading = false;
        });
    },
    addUser() {
      //修改标记
      this.isEdit = false;
      //控制弹窗可见
      this.show = true;

      this.oldOrder = null;
    },
    deleteAllUser() {
      const deleteOrderId = this.selected.map(s => {
        return s.id;
      });

      if (deleteOrderId.length > 0) {
        this.verify()
          .then(() => {
            this.$message
              .confirm("全部删除，不可恢复！")
              .then(() => {
                this.$http
                  .delete("/order/deleteOrder/" + deleteOrderId.join("-"))
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
      this.oldOrder = null;
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
              .delete("/order/deleteUser/" + selectId)
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
    editOrder(oldOrder) {
      this.oldOrder = oldOrder;
      this.$http
        .get("/user/queryUserInfo/" + oldOrder.orderDetails[0].id)
        .then(({ data }) => {
          this.isEdit = true;

          //显示弹窗
          this.show = true;
        })
        .catch();
    }
  },
  components: {
    OrderForm
    // MySeckillForm
  }
};
</script>

<style scoped>
</style>
