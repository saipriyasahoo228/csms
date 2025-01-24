from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ITEM.models import NewIssuance, IssuedThings
from .serializer import NewIssuanceSerializer
from django.utils import timezone
from django.db.models import Q

class IssuedItemsView(APIView):
    def post(self, request):
        white_level_id = request.data.get('white_level_id')
        item_id = request.data.get('item_id')
        validity = request.data.get('validity')

        if not white_level_id:
            return Response({"error": "white_level_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            issued_items = NewIssuance.objects.filter(white_level_id=white_level_id)

            if item_id:
                issued_items = issued_items.filter(issuedthings__item__item_id=item_id)

            if validity is not None:
                current_date = timezone.now().date()
                validity = int(validity)
                expiry_date = current_date + timezone.timedelta(days=validity)
                issued_items = issued_items.filter(issuedthings__expiry_date__lte=expiry_date)

            issued_items = issued_items.prefetch_related('issuedthings_set', 'issuedtoemployee_set').distinct()
            serializer = NewIssuanceSerializer(issued_items, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"An error occurred while retrieving issued items: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
