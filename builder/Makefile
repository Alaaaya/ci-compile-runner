TARGET := iphone:clang:latest:14.0
ARCHS = arm64 arm64e
include $(THEOS)/makefiles/common.mk
TWEAK_NAME = Tweak
Tweak_FILES = Tweak.xm
# Method-only hooks use libobjc directly, with no jailbreak hooking runtime.
Tweak_LOGOS_DEFAULT_GENERATOR = internal
Tweak_CFLAGS = -fobjc-arc -Wno-error
include $(THEOS_MAKE_PATH)/tweak.mk
