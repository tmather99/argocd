include ../../../Makefile

PERFTEST_URL = "https://webclient-${ENV}-${PROJ}.assistdevtest.com"
AUTHMINION_URL = "https://authminion-${ENV}-${PROJ}.assistdevtest.com"

spike:
	k6 run -e PERFTEST_URL=$(PERFTEST_URL) spike.js

peak:
	k6 run -e PERFTEST_URL=$(PERFTEST_URL) peak.js

soak:
	k6 run -e PERFTEST_URL=$(PERFTEST_URL) soak.js

breakpoint:
	k6 run -e PERFTEST_URL=$(PERFTEST_URL) breakpoint.js

device:
	k6 run -e AUTHMINION_URL=$(AUTHMINION_URL) create-device.js
