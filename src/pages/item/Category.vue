<template>
  <v-card>
      <v-flex xs12 sm10>
        <v-tree ref="tree"  url="/item/categoryT/list"
                :isEdit="isEdit"
                @handleAdd="handleAdd"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
                @handleClick="handleClick"
        />
      </v-flex>
  </v-card>
</template>

<script>
  export default {
    name: "category",
    data() {
      return {
        //treeData: treeData,
        isEdit:true,
        leafNode:[],
      }
    },
    methods: {
      handleAdd(node) {
        if (node.parentId !== 0) {
          this.verify().then(() => {
            this.$http({
              method: 'post',
              url: '/item/categoryT',
              data: this.$qs.stringify(node)
            }).then(() => {
              this.reloadData(node.id);
            }).catch();
          }).catch(() => {
            this.$router.push("/login");
          });
        }else {
          this.$message.error("刷新后重试！");
        }
      },
      handleEdit(id,name) {
        const node={
          id:id,
          name:name
        };
        this.verify().then(() => {
          this.$http({
            method: 'put',
            url: '/item/categoryT',
            data: this.$qs.stringify(node)
          }).then(() => {
            this.$message.info("修改成功！");
          }).catch(() => {
            this.$message.info("修改失败！");
          });
        }).catch(() => {
          this.$router.push("/login");
        });
      },
      handleDelete(id) {
        this.verify().then(() => {
          this.$http.delete("/item/categoryT/cid/" + id).then(() => {
            this.$message.info("删除成功！");
          }).catch(() => {
            this.$message.info("删除失败！");
          })
        }).catch(() => {
          this.$router.push("/login");
        });
      },
      handleClick(node) {
        //console.log(node)
      },
      reloadData(id){
        //操作完成后刷新数据
        this.$http.get("/item/categoryT/list?pid="+id).then().catch();
      }
    }
  };
</script>

<style scoped>

</style>
