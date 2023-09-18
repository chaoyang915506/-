<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-5">
                <div class="card">
                    <div class="card-header d-flex justify-content-start">
                        <div class="btn btn-sm btn-outline-primary mr-1">
                            全选
                        </div>
                        <div class="btn btn-sm btn-outline-primary mr-1">
                            全不选
                        </div>
                        <div class="btn btn-sm btn-outline-primary mr-1">
                            反选
                        </div>
                    </div>
                    <div class="card-body">
                        <form class="text-left">
                            <div
                                v-for="(d, i) in data"
                                :key="i"
                                class="custom-control custom-checkbox"
                            >
                                <label class="custom-control-label">
                                    <input
                                        type="checkbox"
                                        class="custom-control-input"
                                    />
                                    {{ d }}</label
                                >
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-2">
                <div
                    class="d-flex h-75 align-items-center justify-content-around"
                >
                    <button class="btn btn-outline-primary">
                        <svg
                            width="1em"
                            height="1em"
                            viewBox="0 0 16 16"
                            class="bi bi-chevron-double-left"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                            />
                        </svg>
                    </button>
                    <button class="btn btn-outline-primary">
                        <svg
                            width="1em"
                            height="1em"
                            viewBox="0 0 16 16"
                            class="bi bi-chevron-double-right"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    class="h-25 d-flex align-items-center justify-content-center"
                >
                    <div class="btn btn-outline-primary mr-1">确定</div>
                    <div class="btn btn-outline-secondary">取消</div>
                </div>
            </div>
            <div class="col-5">
                <div class="card">
                    <div class="card-header justify-content-start d-flex">
                        <div class="btn btn-sm btn-outline-primary mr-1">
                            全选
                        </div>
                        <div class="btn btn-sm btn-outline-primary mr-1">
                            全不选
                        </div>
                        <div class="btn btn-sm btn-outline-primary mr-1">
                            反选
                        </div>
                    </div>
                    <div class="card-body"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CoolTransfer',
    props: {
        value: Array,
        data: {
            type: Array, default: _ => ["aaaaaaaaa", "b", "c", "d", "e", 'f', 'g', "aaaaaaaaa", "b", "c", "d", "e", 'f', 'g', "aaaaaaaaa", "b", "c", "d", "e", 'f', 'g']
        },
    },
}
</script>

<style scoped lang="scss">
.card-body {
    height: 300px;
    overflow: auto;
}
</style>