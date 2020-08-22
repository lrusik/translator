from django.contrib import admin
from django.urls import path
from frontend.views import index
from translator.views import lang_list_view, translate_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index),
    path('api/translate', translate_view),
    path('api/lang_list', lang_list_view)

]
