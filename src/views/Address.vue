<template>
    <div class="address-management-container">

        <div class="address-table-container">
            <div v-if="addresstable && addresstable.length > 0">
                <el-table
                    :data="addresstable"
                    style="width: 100%"
                    :header-cell-style="{
                        background: '#333852',
                        color: '#fff'
                    }"
                >
                    <!-- <el-table-column label="是否为默认地址">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.is_default"
                                active-text="是默认地址"
                                inactive-text="不是默认地址"
                                @change="() => toggleDefault(scope.row)"
                            ></el-switch>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="recipient_name" label="收件人姓名" width="200"></el-table-column>
                    <el-table-column prop="phone_number" label="收件人电话号码" width="200"></el-table-column>
                    <el-table-column prop="detailed_address" label="详细地址" width="350"></el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
                            <el-popconfirm title="确定删除吗?" @confirm="del(scope.row)">
                                <el-button slot="reference" type="danger">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else>
                暂无地址数据。
            </div>
        </div>
        <div class="address-action-buttons">
            <el-button type="primary" @click="add()">新建地址</el-button>
        </div>
        <div class="address-dialog-container">
            <el-dialog title="填写地址信息" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="收件人姓名" :label-width="formLabelWidth">
                        <el-input v-model="form.recipient_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="收件人电话号码" :label-width="formLabelWidth">
                        <el-input v-model="form.phone_number" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" :label-width="formLabelWidth">
                        <el-input v-model="form.detailed_address" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="是否为默认地址" :label-width="formLabelWidth">
                        <el-input v-model="form.is_default" autocomplete="off"></el-input>
                    </el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>


<script>
import request from '@/utils/request.js';
import router from '@/router';
export default {
    data() {
        return {
            dialogFormVisible: false,
            formLabelWidth: '120px',
            form: {},
            user: JSON.parse(localStorage.getItem('userAccount') || '{}'),
            addresstable: [],
        }
    },
    mounted() {
        this.findByAccount();
    },
    methods: {
        add() {
            this.form = {};
            this.dialogFormVisible = true;
            this.findByAccount();
        },
        edit(address) {
            this.form = address;
            this.dialogFormVisible = true;
        },
        del(address) {
            request.delete('/address/del/' + address.address_id).then((res) => {
                if (res.code === '0') {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.findByAccount();
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            });
        },
        findByAccount() {
            request.get("/address/selectByAccount/" + this.user).then(res => {
                if (res.code === '0') {
                    this.addresstable = res.data;
                }
            })
        },
        submit() {
            this.form.cus_account = this.user;
            request.post("/address/submit", this.form).then(res => {
                if (res.code === '0') {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.dialogFormVisible = false;
                    this.findByAccount();
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
            })
        },
        // toggleDefault(address) {
        //     const hasOtherDefault = this.addresstable.some((item) => item.is_default && item!== address);
        //     if (hasOtherDefault) {
        //         // 如果有其他默认地址，将当前地址设为默认地址，同时取消其他地址的默认状态
        //         this.addresstable.forEach((item) => {
        //             this.form = item;
        //             this.form.is_default = 0;
        //             this.submit();
        //             this.form = {};
        //         });
        //     }
        //     this.form = address;
        //     this.form.is_default = 1;
        //     this.submit();
        //     this.form = {};
        // }
    }
}
</script>

<style scoped>

.address-management-container {
    padding: 20px;
    background-color: white;
}

.address-action-buttons {
    margin-bottom: 15px;
}

.address-table-container {
    margin-bottom: 15px;
}

.address-dialog-container {
    margin-bottom: 15px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

.dialog-footer el-button {
    margin-left: 10px;
}
</style>