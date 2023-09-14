<template>
  <div class="loginForm">
    <div class="content">
      <q-card dark bordered class="bg-grey-9">
        <q-card-section class="text-center">
          <div class="text-h6">AQUILA</div>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section>
          {{ subTitle }}
        </q-card-section>
      </q-card>
      <q-form @submit="onSubmit" @reset="onReset" class="q-mt-xl q-gutter-md">
        <q-input
          filled
          v-model="name"
          label="Email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          type="password"
          label="Password"
          v-model="age"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-toggle v-model="accept" label="Save credentials?" />
      </q-form>
      <q-btn
        label="Submit"
        type="submit"
        color="primary"
        flat
        class="q-mt-xl"
      />
    </div>
  </div>
</template>
<style lang="scss">
.loginForm {
  margin-top: 6em;
  display: flex;
  justify-content: center;
}
.content {
  padding: 45px;
  background-color: rgba(127, 127, 129, 0.774);
  min-height: 600px;
  min-width: 450px;
  max-width: 450px;
  margin: 2em;
}
body {
  background-color: antiquewhite;
}
</style>
<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    const name = ref(null);
    const age = ref(null);
    const accept = ref(false);

    return {
      name,
      age,
      accept,
      subTitle: "Otimizando suas ordens com agilidade e referência!",
      onSubmit() {
        if (accept.value !== true) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "You need to accept the license and terms first",
          });
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted",
          });
        }
      },

      onReset() {
        name.value = null;
        age.value = null;
        accept.value = false;
      },
    };
  },
};
</script>
