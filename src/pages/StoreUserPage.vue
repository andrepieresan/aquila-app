<template>
  <div class="row justify-center" style="height: 250px">
    <div>
      <q-card dark bordered class="bg-grey-9 my-card">
        <q-card-section class="text-center">
          <div class="text-h6">AQUILA</div>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section>
          {{ subTitle }}
        </q-card-section>
      </q-card>
    </div>
    <div class="content col-4">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
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
      <div>
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
          flat
          class="center"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.q-btn {
  margin-top: 100px;
}
.my-card {
  margin-top: 6em;
  width: 100%;
  max-width: 250px;
}
.content {
  margin: 450px;
  position: absolute;
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
