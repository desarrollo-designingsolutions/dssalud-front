<script lang="ts" setup>
import navItems from '@/navigation/vertical'
import { themeConfig } from '@themeConfig'

// Components 
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'

import { useAuthenticationStore } from "@/stores/useAuthenticationStore"
const authenticationStore = useAuthenticationStore();


</script>

<template>
  <div>
    <ChannelsGlobal />

    <VerticalNavLayout :nav-items="navItems">
      <!-- 👉 navbar -->
      <template #navbar="{ toggleVerticalOverlayNavActive }">
        <div class="d-flex h-100 align-center">
          <IconBtn id="vertical-nav-toggle-btn" class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
            <VIcon size="26" icon="tabler-menu-2" />
          </IconBtn>

          <NavbarThemeSwitcher />

          <VSpacer />


          <ProgressCircularChannel :channel="'assignment.' + authenticationStore.user.id"
            tooltipText="Cargando asignaciones" />

          <ProgressCircularChannel :channel="'csv_import_progress_assignment.' + authenticationStore.user.id"
            tooltipText="Cargando Validacion de estructura en Csv de asignaciones" />
            
            <ProgressCircularChannel :channel="'glosa.' + authenticationStore.user.id" tooltipText="Cargando glosas" />
            
            <ProgressCircularChannel :channel="'csv_import_progress_glosa.' + authenticationStore.user.id"
              tooltipText="Cargando Validacion de estructura en Csv de glosas" />

          <ProgressCircularChannel :channel="'glosa_service_jobs.' + authenticationStore.user.id"
            tooltipText="Cargando servicios" />


          <NavBarI18n v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
            :languages="themeConfig.app.i18n.langConfig" />
          <NavBarNotificationBell class="me-1" />
          <UserProfile />
        </div>
      </template>

      <!-- 👉 Pages -->
      <slot />

      <!-- 👉 Footer -->
      <template #footer>
        <Footer />
      </template>

      <!-- 👉 Customizer -->
      <!-- <TheCustomizer /> -->
    </VerticalNavLayout>


  </div>

</template>
