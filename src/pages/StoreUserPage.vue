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
          v-model="form.email"
          label="Email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          type="password"
          label="Password"
          v-model="form.pwd"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-toggle v-model="accept" label="Save credentials?" />
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
          flat
          class="q-mt-xl"
        />
      </q-form>
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
</style>
<script>
import { ref } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/Auth";

export default {
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    const form = ref({
      email: "",
      pwd: "",
    });
    const accept = ref(false);

    const getToken = async (email, password) => {
      const data = { email, password };

      return await api
        .post("/login", data)
        .then((res) => res?.data?.data)
        .catch((e) => {});
    };

    const onSubmit = async () => {
      let { email, pwd } = form.value;

      let { token, user_id } = await getToken(email, pwd);

      console.log({ token, user_id });

      if (!token) {
        alert("sem autorizacao");
        return true;
      }

      useAuthStore().setCredentials(token, user_id);

      $q.cookies.set("xapi", token);
      $q.cookies.set("xid", user_id);

      $router.push("/os-history");
    };

    return {
      form,
      accept,
      subTitle: "Otimizando suas ordens com agilidade e referência!",
      onSubmit,
    };
  },
};
</script>
