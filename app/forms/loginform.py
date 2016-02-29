#-*- coding: utf-8 -*-
from flask_security.forms import LoginForm, NextFormMixin
from wtforms import StringField, PasswordField, validators, \
           SubmitField, HiddenField, BooleanField, ValidationError, Field
from app.models import user_datastore

class MyLoginForm(LoginForm, NextFormMixin):
    name = StringField(u'用户名', render_kw={"placeholder": u"填写用户名"})
    password = PasswordField(u'密码', render_kw={"placeholder": u"填写用户名"})
    remember = BooleanField(u'记住我')
    submit = SubmitField(u'登录')

    def __init__(self, *args, **kwargs):
        super(MyLoginForm, self).__init__(*args, **kwargs)
        if not self.next.data:
            self.next.data = '/'
        #self.remember.default = config_value('DEFAULT_REMEMBER_ME')

    def validate(self):
        if not super(LoginForm, self).validate():
            return False

        if self.name.data.strip() == '' or (not self.name.data.isalnum()):
            self.submit.errors.append(u'无用户名或格式错误')
            return False

        if self.password.data.strip() == '':
            self.submit.errors.append('请填写密码')
            return False

        self.user = user_datastore.get_user(self.name.data)

        if self.user is None:
            self.submit.errors.append(u'用户名或密码错误')
            return False
        if not self.user.password:
            self.submit.errors.append(u'用户名或密码错误')
            return False
        #if not verify_and_update_password(self.password.data, self.user):

        if not self.password.data == self.user.password:
            self.submit.errors.append(u'用户名或密码错误')
            return False

#       if requires_confirmation(self.user):
#            self.email.errors.append('CONFIRMATION_REQUIRED')
#            return False

        if not self.user.is_active():
            self.submit.errors.append(u'用户被禁用')
            return False

        return True

