import os

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls import include, url
from django.views.static import serve
from django.utils.translation import gettext as _

import requests
from requests import Response
from requests.exceptions import RequestException

import json, shutil
from app.plugins import PluginBase, Menu, MountPoint


class Plugin(PluginBase):

    def main_menu(self):
        return [Menu(_("Vista-360"), self.public_url(''), "fa fa-circle-notch fa-fw")]

    def app_mount_points(self):

        @login_required
        def viewer_360(request):
            
            args = {
                'title': '360 Panorama Viewer',
                'image': 'https://droneslpl.arcelormittal.com/media/CACHE/images/settings/360/DJI_0707.JPG'
            }
            
            return render(request, self.template_path('viewer360.html'), args)

        return [
            MountPoint('$', viewer_360)
            ]