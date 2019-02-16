Vue.component('vue-button', {
    props: ["item"],
    template: '<button class="btn">{{ item.text }}</button>'
});