<template>
  <div data-root>
    <!-- <modal
      v-for="(item,index) in modalList"
      :key="item.id"
      v-bind="item.option"
      :name="index"
      v-show="item.active"
      @close="closeModal"
    />-->
    <modal
      :key="modalList['check-close'].id"
      v-bind="modalList['check-close'].option"
      name="check-close"
      v-show="modalList['check-close'].active"
      @close="closeModal"
    />
    <modal
      :key="modalList['first-open'].id"
      v-bind="modalList['first-open'].option"
      name="first-open"
      v-show="modalList['first-open'].active"
      @close="closeModal"
    />
    <modal
      :key="modalList['notice'].id"
      v-bind="modalList['notice'].option"
      name="notice"
      v-show="modalList['notice'].active"
      @close="closeModal"
    />
    <!-- <modal
      :key="modalList['login'].id"
      v-bind="modalList['login'].option"
      name="login"
      v-show="modalList['login'].active"
      @close="login"
    >
      <section id="login-box">
        <div class="form-line" id="name-box">
          <label for="login-name">用户名</label>
          <input type="text" v-model="name" id="login-name" :pattern="namePattern" placeholder="请输入用户名" />
        </div>
        <div class="form-line" id="pass-box">
          <label for="login-pass">密码</label>
          <input type="password" v-model="password" id="login-pass" :pattern="passPattern" placeholder="请输入密码" />
        </div>
      </section>
    </modal> -->
  </div>
</template>

<script src="./modals.ts"/>

<style lang="stylus" scoped>
[data-root] {
  position: absolute;
  background: transparent;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  #login-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .form-line {
      display: flex;
      width: 300px;
      height: 40px;
      align-items: center;
      margin: 10px 0;

      label {
        width: 60px;
        color: var(--normal);
        font-size: var(--m);
      }

      input {
        color: var(--info);
        font-size: var(--s);
        margin-left: 5px;
        line-height: 30px;
        flex: 1;
        border-bottom: 1px solid var(--primary);
        text-indent: 5px;

        &:invalid {
          border: 2px solid var(--red);
        }
      }
    }
  }
}
</style>