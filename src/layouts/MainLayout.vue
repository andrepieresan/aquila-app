<template>
  <div class="q-pa-md" style="margin: 1em">
    <q-layout
      view="lHh Lpr lff"
      container
      style="height: 90vh"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated style="background-color: rgba(108, 136, 161, 0.637)">
        <q-toolbar>
          <q-toolbar-title class="text-center">{{
            headerTitle
          }}</q-toolbar-title>
          <q-btn
            flat
            @click="drawer ? (drawer = '') : (drawer = 'inbox')"
            round
            dense
            icon="menu"
          />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="400"
        style="background-color: rgba(108, 136, 161, 0.637)"
      >
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list>
            <q-item
              to="/os-history"
              clickable
              v-ripple
              @click="
                headerTitle = 'Atendimento';
                drawer = 'inbox';
              "
              active-class="menu-link"
            >
              <q-item-section avatar>
                <q-icon name="today" />
              </q-item-section>

              <q-item-section>Atendimentos</q-item-section>
            </q-item>

            <q-item
              to="/create-os"
              clickable
              v-ripple
              @click="
                headerTitle = 'Abrir Os';
                drawer = 'inbox';
              "
              active-class="menu-link"
            >
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>Abrir OS</q-item-section>
            </q-item>

            <q-item
              to="/stock"
              clickable
              v-ripple
              @click="
                headerTitle = 'Estoque';
                drawer = 'inbox';
              "
              active-class="menu-link"
            >
              <q-item-section avatar>
                <q-icon name="find_in_page" />
              </q-item-section>

              <q-item-section>Estoque</q-item-section>
            </q-item>

            <q-item
              to="/user"
              clickable
              v-ripple
              @click="
                headerTitle = 'Perfil';
                drawer = 'inbox';
              "
              active-class="menu-link"
            >
              <q-item-section avatar>
                <q-icon name="supervisor_account" />
              </q-item-section>

              <q-item-section>Perfil</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div id="userInfo" class="absolute-top">
          <div class="text-weight-bold">{{ userName }}</div>
          <div>{{ userRole }}</div>
        </div>
      </q-drawer>

      <q-page-container>
        <q-page padding><router-view /></q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style lang="scss">
.menu-link {
  color: #000;
  background: #5e5c5c7c;
}
</style>

<script>
import { ref } from "vue";
export default {
  setup() {
    return {
      drawer: ref(""),
      userName: "ADONIS",
      userRole: "technical assistance \nmanager",
      headerTitle: ref("Atendimentos"),
    };
  },
};
</script>
