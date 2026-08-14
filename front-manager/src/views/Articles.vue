<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { articleApi } from '@/api/handleapi';
import type { ArticleEditForm, ArticleListItem, ArticleStatus } from '@/types';
import ArticleEdit from '@/components/ArticleEdit.vue';

//var
const tabname=ref<ArticleStatus>('published')
const page=ref(1)
const limit=ref(10)
const total=ref(0)
const keyword=ref('')
const saving = ref(false)
const articledata=ref<ArticleListItem[]>([])
const editdialogVisible = ref(false)
const singlearticledata = ref<ArticleEditForm>({
  id: 0,
  title: '',
  content: '',
  summary: '',
  status: 'draft',
})

//获取文章
const fetcharticle=async()=>{
    const res=await articleApi.getList({page:page.value,limit:limit.value,keyword:keyword.value,status:tabname.value})
    articledata.value=res.data.list ||[]
    total.value=res.data.total||0
}
//id获取文章
const fetcharticleById=async(id:number)=>{
    try {
        const res = await articleApi.getDetail(id)
        const a=res.data
        singlearticledata.value = {
            id: a.id,
            title: a.title,
            content: a.content || '',
            summary: a.summary || '',
            status: a.status === 'published' ? 'published' : 'draft',
        }
    } catch (error) {
        ElMessage.error('加载文章详情失败')
    }
}

//换页
const handlepagechange=(newPage:number)=>{
  page.value = newPage
  fetcharticle()
}

// 打开编辑弹窗
const editarticle = (row: ArticleListItem) => {
    fetcharticleById(row.id)
    editdialogVisible.value = true
}



// 保存修改
const savearticle = async () => {
  if (!singlearticledata.value.title.trim() || !singlearticledata.value.content.trim()) {
    ElMessage.warning('标题和内容不能为空')
    return
  }
  saving.value = true
  try {
    await articleApi.update(singlearticledata.value.id, {
      title: singlearticledata.value.title,
      content: singlearticledata.value.content,
      summary: singlearticledata.value.summary,
      status: singlearticledata.value.status,
    })
    ElMessage.success('保存成功')
    editdialogVisible.value = false
    fetcharticle()
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 删除文章（带确认框）
const deletearticle = async (row: ArticleListItem) => {
  try {
    await ElMessageBox.confirm(`确定删除「${row.title}」？`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch { return }
  try {
    await articleApi.delete(row.id)
    ElMessage.success('删除成功')
    fetcharticle()
  } catch {
    ElMessage.error('删除失败')
  }
}
//切换标签
const tabClick=(tab:any)=>{
    tabname.value=tab.props.name
    page.value=1
    articledata.value=[]
    fetcharticle()
}

//监听keyword搜索
watch(keyword,()=>{
    page.value=1
    fetcharticle()
})

onMounted(()=>{
    fetcharticle()
})

</script>
<template>
    <div class="body">
        <div class="card">
            <div class="search">
                <el-input v-model="keyword" clearable placeholder="搜索文章标题或摘要">
                    <template #prepend>搜索</template>
                </el-input>
            </div>
            <el-tabs v-model="tabname" @tab-click="tabClick" type="border-card">
                <el-tab-pane label="已发布" name="published">
                    <el-table :data="articledata" style="width: 100%;" border>
                        <el-table-column type="selection" />    
                        <el-table-column prop="id" label="id" width="180"></el-table-column>
                        <el-table-column prop="title" label="标题" width="180"></el-table-column>
                        <el-table-column prop="created_at" label="创建时间" width="200"></el-table-column>
                        <el-table-column label="操作" width="160">
                            <template #default="scope">
                                <el-button type="primary" size="small" @click="editarticle(scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="deletearticle(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="草稿" name="draft">
                    <el-table :data="articledata" style="width: 100%;" border>
                        <el-table-column type="selection" />    
                        <el-table-column prop="id" label="id" width="180"></el-table-column>
                        <el-table-column prop="title" label="标题" width="180"></el-table-column>
                        <el-table-column prop="created_at" label="创建时间" width="200"></el-table-column>
                        <el-table-column label="操作" width="160">
                            <template #default="scope">
                                <el-button type="primary" size="small" @click="editarticle(scope.row)">编辑</el-button>
                                <el-button type="danger" size="small" @click="deletearticle(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div class="pagination">
                <el-pagination layout="prev,pager,next,total,jumper" background :total="total" :page-size="limit" v-model:current-page="page" @current-change="handlepagechange"></el-pagination>
            </div>
        </div>
        <!-- 编辑弹窗 -->
        <el-dialog v-model="editdialogVisible" title="编辑文章" width="640px">
            <ArticleEdit
                v-model="singlearticledata"
                :saving="saving"
                @save="savearticle"
                @cancel="editdialogVisible = false"
            />
        </el-dialog>
    </div>
</template>
<style scoped>
.body {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px var(--page-padding-x) 64px;
}
.card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 24px;
    box-shadow: 0 2px 8px var(--shadow);
}
.body :deep(.el-tabs--border-card) {
    border: none;               /* 外层 .card 已提供边框 */
    background: transparent;
    box-shadow: none;
}
.body :deep(.el-table) {
  --el-table-bg-color: var(--bg-card);            /* 表格主体背景 */
  --el-table-tr-bg-color: var(--bg-card);          /* 行背景 */
  --el-table-header-bg-color: var(--navbar-bg);    /* 表头背景 */
  --el-table-row-hover-bg-color: var(--bg);        /* 悬停行背景 */
  --el-table-border-color: var(--border);          /* 边框色 */
  background-color: var(--bg-card);
}
.pagination{
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}
.search {
    margin-bottom: 16px;
}

@media (max-width: 768px) {
    .body {
        padding-top: 20px;
    }
    .card {
        padding: 12px;
    }
}

</style>
