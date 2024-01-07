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
          <q-btn
            flat
            @click="drawer ? (drawer = '') : (drawer = 'inbox')"
            round
            dense
            icon="menu"
          />
          <q-toolbar-title class="text-center"
            >{{ headerTitle.name }}
          </q-toolbar-title>

          <q-btn
            flat
            @click="setModal(headerTitle.key)"
            round
            dense
            icon="add_circle"
          />
        </q-toolbar>
      </q-header>
      <Modal
        v-model="os_modal"
        @close="modal"
        type="store_os"
        title="Criar ordem de serviço"
      />
      <Modal
        v-model="reports_modal"
        @close="modal"
        type="reports"
        title="Criar relátorio"
      />
      <Modal
        v-model="material_modal"
        @close="modal"
        type="material"
        title="Cadastrar material"
      />
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
              @click="this.setHeader({ name: 'Lista de serviços', key: 'os' })"
              active-class="menu-link"
            >
              <q-item-section avatar>
                <q-icon name="today" />
              </q-item-section>

              <q-item-section>Lista de serviços</q-item-section>
            </q-item>

            <!-- <q-item
              to="/create-os"
              clickable
              v-ripple
              @click="headerTitle = 'Abrir Os'"
              active-class="menu-link"
            >
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>Abrir OS</q-item-section>
            </q-item> -->

            <q-item
              to="/report"
              clickable
              v-ripple
              @click="this.setHeader({ name: 'Relatórios', key: 'reports' })"
              active-class="menu-link"
            >
              <q-item-section avatar>
                <q-icon name="find_in_page" />
              </q-item-section>

              <q-item-section>Relatórios</q-item-section>
            </q-item>

            <q-item
              to="/material"
              clickable
              v-ripple
              @click="this.setHeader({ name: 'Materiais', key: 'material' })"
              active-class="menu-link"
            >
              <q-item-section avatar>
                <q-icon name="build_circle" />
              </q-item-section>

              <q-item-section>Materiais</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div id="userInfo" class="absolute-top">
          <div class="text-weight-bold">{{ userName }}</div>
          <div>{{ userRole }}</div>
        </div>
      </q-drawer>

      <q-page-container>
        <q-page><router-view /></q-page>
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
import Modal from "src/components/Modal.vue";
import { ref, inject } from "vue";

export default {
  components: { Modal },
  data() {
    const bus = inject("bus");
    const drawer = ref("");
    let material_modal = ref(false);
    let reports_modal = ref(false);
    let os_modal = ref(false);
    let modal = ref(false);

    bus.on("close-modal", () => {
      console.log("test");
      material_modal.value = ref(false);
      reports_modal.value = ref(false);
      os_modal.value = ref(false);
    });
    bus.on("close-drawer", () => {
      drawer.value = "inbox";
    });
    bus.on("open-drawer", () => {
      drawer.value = "";
      console.log("asawa");
    });
    return {
      material_modal,
      reports_modal,
      os_modal,
      setHeader(header) {
        this.headerTitle.name = header.name;
        this.headerTitle.key = header.key;
      },
      setModal(modal) {
        switch (modal) {
          case "material":
            this.material_modal = true;
            break;
          case "reports":
            this.reports_modal = true;
            break;
          case "os":
            this.os_modal = true;
            break;
          default:
            break;
        }
      },
      modal,
      drawer,
      userName: "ADONIS",
      userRole: "technical assistance \nmanager",
      headerTitle: ref({ name: "", key: "" }),
    };
  },
};
</script>
